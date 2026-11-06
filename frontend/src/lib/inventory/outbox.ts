import { eq, or, and, lt } from "drizzle-orm";
import { db, type DbClient } from "@/lib/db";
import {
  inventoryNotificationOutbox,
  type NewInventoryNotificationOutbox,
  type InventoryNotificationOutbox,
} from "@/lib/db/schema/outbox";
import { sendTelegramMessage } from "@/lib/telegram";

/**
 * Persists an outbox notification event within an existing transaction or client.
 */
export async function recordOutboxNotification(
  input: {
    channel?: string;
    eventType: string;
    referenceId: string;
    payload: Record<string, unknown>;
  },
  tx?: DbClient
): Promise<InventoryNotificationOutbox> {
  const client = tx || db;

  const [record] = await client
    .insert(inventoryNotificationOutbox)
    .values({
      channel: input.channel || "telegram",
      eventType: input.eventType,
      referenceId: input.referenceId,
      payload: input.payload,
      status: "pending",
      attempts: 0,
      maxAttempts: 5,
    })
    .returning();

  return record;
}

/**
 * Updates the delivery status of an outbox notification record.
 */
export async function updateOutboxDeliveryStatus(
  id: string,
  result: {
    success: boolean;
    error?: string;
  },
  client: DbClient = db
): Promise<void> {
  const now = new Date();

  if (result.success) {
    await client
      .update(inventoryNotificationOutbox)
      .set({
        status: "delivered",
        deliveredAt: now,
        lastAttemptAt: now,
        lastError: null,
      })
      .where(eq(inventoryNotificationOutbox.id, id));
  } else {
    // Increment attempts and record error
    const [existing] = await client
      .select({ attempts: inventoryNotificationOutbox.attempts })
      .from(inventoryNotificationOutbox)
      .where(eq(inventoryNotificationOutbox.id, id))
      .limit(1);

    const currentAttempts = existing ? existing.attempts + 1 : 1;

    await client
      .update(inventoryNotificationOutbox)
      .set({
        status: "failed",
        attempts: currentAttempts,
        lastAttemptAt: now,
        lastError: result.error?.slice(0, 500) || "Unknown delivery failure",
      })
      .where(eq(inventoryNotificationOutbox.id, id));
  }
}

/**
 * Dispatches a single outbox event with idempotency and duplicate prevention.
 * If the notification has already been delivered, dispatch is safely skipped.
 */
export async function dispatchOutboxNotification(
  outboxId: string,
  client: DbClient = db
): Promise<{ success: boolean; skipped?: boolean; error?: string }> {
  try {
    const [outboxRecord] = await client
      .select()
      .from(inventoryNotificationOutbox)
      .where(eq(inventoryNotificationOutbox.id, outboxId))
      .limit(1);

    if (!outboxRecord) {
      return { success: false, error: "Outbox notification record not found." };
    }

    // Duplicate prevention: never resend an already-delivered notification
    if (outboxRecord.status === "delivered") {
      return { success: true, skipped: true };
    }

    const payload = outboxRecord.payload as Record<string, unknown>;
    const text = (payload?.formattedMessage as string) || "";

    if (!text) {
      const err = "Outbox notification payload missing formattedMessage text.";
      await updateOutboxDeliveryStatus(outboxId, { success: false, error: err }, client);
      return { success: false, error: err };
    }

    const result = await sendTelegramMessage(text, {
      parseMode: "HTML",
      disableWebPagePreview: true,
    });

    await updateOutboxDeliveryStatus(
      outboxId,
      {
        success: result.success,
        error: result.error,
      },
      client
    );

    return {
      success: result.success,
      error: result.error,
    };
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unexpected outbox error";
    await updateOutboxDeliveryStatus(outboxId, { success: false, error: errMessage }, client);
    return { success: false, error: errMessage };
  }
}

/**
 * Retries undelivered or failed outbox notifications.
 */
export async function retryPendingOutboxNotifications(
  limit = 10,
  client: DbClient = db
): Promise<{
  total: number;
  delivered: number;
  failed: number;
}> {
  const pendingRecords = await client
    .select()
    .from(inventoryNotificationOutbox)
    .where(
      or(
        eq(inventoryNotificationOutbox.status, "pending"),
        and(
          eq(inventoryNotificationOutbox.status, "failed"),
          lt(
            inventoryNotificationOutbox.attempts,
            inventoryNotificationOutbox.maxAttempts
          )
        )
      )
    )
    .limit(limit);

  let delivered = 0;
  let failed = 0;

  for (const record of pendingRecords) {
    const res = await dispatchOutboxNotification(record.id, client);
    if (res.success) {
      delivered++;
    } else {
      failed++;
    }
  }

  return {
    total: pendingRecords.length,
    delivered,
    failed,
  };
}
