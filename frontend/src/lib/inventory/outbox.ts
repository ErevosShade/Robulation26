import { eq } from "drizzle-orm";
import { db, type DbClient } from "@/lib/db";
import {
  inventoryNotificationOutbox,
  type NewInventoryNotificationOutbox,
  type InventoryNotificationOutbox,
} from "@/lib/db/schema/outbox";

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
