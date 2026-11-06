if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

// Enable Telegram mock mode for deterministic zero-network test execution
process.env.TELEGRAM_MOCK_MODE = "true";

import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { inventoryNotificationOutbox } from "../lib/db/schema/outbox";
import {
  recordOutboxNotification,
  updateOutboxDeliveryStatus,
  dispatchOutboxNotification,
  retryPendingOutboxNotifications,
} from "../lib/inventory/outbox";

interface TestReport {
  name: string;
  passed: boolean;
  details: string;
}

const reports: TestReport[] = [];

function recordTest(name: string, passed: boolean, details: string) {
  reports.push({ name, passed, details });
  console.log(`${passed ? "✓ PASS" : "✗ FAIL"}: ${name} - ${details}`);
}

export async function runOutboxTests() {
  console.log("=== Starting Notification Outbox & Retry Test Suite ===");

  const testRefId = `test-ref-${Date.now()}`;
  let outboxId1 = "";
  let outboxId2 = "";

  try {
    // 1. Record pending outbox notification
    const record1 = await recordOutboxNotification({
      channel: "telegram",
      eventType: "borrow_request_created",
      referenceId: testRefId,
      payload: {
        test: true,
        formattedMessage: "Test Telegram Notification Content",
      },
    });

    outboxId1 = record1.id;
    recordTest(
      "Outbox Persistence - Initial Pending State",
      Boolean(record1 && record1.status === "pending" && record1.attempts === 0),
      `Successfully persisted outbox notification ID ${record1.id} with status 'pending'.`
    );

    // 2. Dispatch notification in mock mode
    const dispatchResult1 = await dispatchOutboxNotification(outboxId1);
    recordTest(
      "Outbox Dispatch - Mock Delivery",
      Boolean(dispatchResult1.success && !dispatchResult1.skipped),
      "Successfully dispatched pending outbox notification in mock mode."
    );

    // Verify status updated to 'delivered' in DB
    const [deliveredRecord] = await db
      .select()
      .from(inventoryNotificationOutbox)
      .where(eq(inventoryNotificationOutbox.id, outboxId1))
      .limit(1);

    recordTest(
      "Outbox Status Update - Delivered",
      Boolean(
        deliveredRecord &&
          deliveredRecord.status === "delivered" &&
          deliveredRecord.deliveredAt !== null
      ),
      `Verified outbox record status updated to 'delivered' with timestamp.`
    );

    // 3. Duplicate Prevention: Dispatching already delivered event must skip
    const duplicateDispatchResult = await dispatchOutboxNotification(outboxId1);
    recordTest(
      "Duplicate Prevention - Skip Already Delivered",
      Boolean(duplicateDispatchResult.success && duplicateDispatchResult.skipped),
      "Strictly skipped re-sending already delivered notification."
    );

    // 4. Failed delivery handling and retry mechanics
    const record2 = await recordOutboxNotification({
      channel: "telegram",
      eventType: "borrow_request_created",
      referenceId: `${testRefId}-fail`,
      payload: {
        test: true,
        formattedMessage: "Simulated Delivery Failure Message",
      },
    });
    outboxId2 = record2.id;

    // Simulate failure by recording delivery failure directly
    await updateOutboxDeliveryStatus(outboxId2, {
      success: false,
      error: "Simulated Telegram 503 Service Unavailable",
    });

    const [failedRecord] = await db
      .select()
      .from(inventoryNotificationOutbox)
      .where(eq(inventoryNotificationOutbox.id, outboxId2))
      .limit(1);

    recordTest(
      "Outbox Status Update - Failure Tracking",
      Boolean(
        failedRecord &&
          failedRecord.status === "failed" &&
          failedRecord.attempts === 1 &&
          failedRecord.lastError?.includes("Simulated Telegram 503")
      ),
      "Recorded failed status with attempt count increment and sanitized error log."
    );

    // 5. Retry pending/failed notifications
    const retryResult = await retryPendingOutboxNotifications(10);
    recordTest(
      "Outbox Retry Processing",
      retryResult.total > 0 && retryResult.delivered > 0,
      `Processed retry batch: total=${retryResult.total}, delivered=${retryResult.delivered}, failed=${retryResult.failed}.`
    );

    // Verify record2 transitioned to delivered after retry
    const [retriedRecord] = await db
      .select()
      .from(inventoryNotificationOutbox)
      .where(eq(inventoryNotificationOutbox.id, outboxId2))
      .limit(1);

    recordTest(
      "Failed Record Recovered via Retry",
      Boolean(retriedRecord && retriedRecord.status === "delivered"),
      "Previously failed notification was successfully delivered and marked 'delivered' during retry."
    );
  } finally {
    // Cleanup test outbox records
    try {
      if (outboxId1) {
        await db
          .delete(inventoryNotificationOutbox)
          .where(eq(inventoryNotificationOutbox.id, outboxId1));
      }
      if (outboxId2) {
        await db
          .delete(inventoryNotificationOutbox)
          .where(eq(inventoryNotificationOutbox.id, outboxId2));
      }
    } catch {}
  }

  const passedCount = reports.filter((r) => r.passed).length;
  console.log(
    `=== Outbox Test Suite Summary: ${passedCount}/${reports.length} passed ===\n`
  );

  if (passedCount !== reports.length) {
    throw new Error("One or more outbox tests failed.");
  }
}

if (process.argv[1]?.endsWith("testOutboxRetry.ts")) {
  runOutboxTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Outbox test runner failed:", err);
      process.exit(1);
    });
}
