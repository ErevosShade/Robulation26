if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

process.env.TELEGRAM_MOCK_MODE = "true";

import { eq, inArray } from "drizzle-orm";
import { db } from "../lib/db";
import { inventoryItems, inventoryLedger } from "../lib/db/schema/inventory";
import {
  inventoryRequests,
  inventoryRequestItems,
} from "../lib/db/schema/requests";
import { inventoryNotificationOutbox } from "../lib/db/schema/outbox";
import { createInventoryItem } from "../lib/inventory/service";
import { createBorrowRequest } from "../lib/inventory/requests";
import { InventoryError } from "../lib/inventory/errors";

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

export async function runBorrowRequestsIntegrationTests() {
  console.log("=== Starting Borrow Request Creation & Stock Invariant Suite ===");

  const timestamp = Date.now();
  const testSku1 = `TEST-ITEM-A-${timestamp}`;
  const testSku2 = `TEST-ITEM-B-${timestamp}`;
  const testSkuArchived = `TEST-ITEM-ARCH-${timestamp}`;

  let itemId1 = "";
  let itemId2 = "";
  let itemArchivedId = "";
  let requestId1 = "";
  let requestId2 = "";

  const mockUser = {
    id: `pilot-user-${timestamp}`,
    name: "Alex Vance",
    email: `alex.vance.${timestamp}@robolution.space`,
    role: "member",
  };

  try {
    // 1. Create test hardware items
    const item1 = await createInventoryItem(
      {
        name: `LiDAR Puck v1 ${timestamp}`,
        sku: testSku1,
        category: "Sensors",
        totalQuantity: 10,
        minimumStock: 2,
      },
      "admin@robolution.space"
    );
    itemId1 = item1.id;

    const item2 = await createInventoryItem(
      {
        name: `NVIDIA Jetson Nano ${timestamp}`,
        sku: testSku2,
        category: "Compute",
        totalQuantity: 5,
        minimumStock: 1,
      },
      "admin@robolution.space"
    );
    itemId2 = item2.id;

    const itemArch = await createInventoryItem(
      {
        name: `Deprecated Servo ${timestamp}`,
        sku: testSkuArchived,
        category: "Actuators",
        totalQuantity: 3,
        minimumStock: 0,
      },
      "admin@robolution.space"
    );
    itemArchivedId = itemArch.id;

    // Archive itemArch
    await db
      .update(inventoryItems)
      .set({ archived: true, archivedAt: new Date() })
      .where(eq(inventoryItems.id, itemArchivedId));

    // Capture ledger count before creating borrow request
    const ledgerBefore = await db
      .select()
      .from(inventoryLedger)
      .where(eq(inventoryLedger.itemId, itemId1));

    // 2. Submit single-item borrow request
    const createResult1 = await createBorrowRequest(mockUser, {
      project: "Mars Rover Obstacle Avoidance Test",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 3),
      items: [{ itemId: itemId1, quantity: 4 }],
    });

    requestId1 = createResult1.request.id;

    recordTest(
      "Single-Item Request Creation",
      Boolean(
        createResult1.request &&
          createResult1.request.status === "pending" &&
          createResult1.request.items.length === 1 &&
          createResult1.request.items[0]?.quantity === 4
      ),
      `Successfully created borrow request ${requestId1} with status 'pending'.`
    );

    // 3. CRITICAL STOCK INVARIANT VERIFICATION
    // Check that item stock balances were NOT mutated
    const [fetchedItem1] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemId1))
      .limit(1);

    const stockUnchanged =
      fetchedItem1 &&
      fetchedItem1.totalQuantity === 10 &&
      fetchedItem1.reservedQuantity === 0 &&
      fetchedItem1.checkedOutQuantity === 0 &&
      fetchedItem1.damagedQuantity === 0;

    recordTest(
      "Stock Balance Invariant - Zero Mutation on Request",
      Boolean(stockUnchanged),
      `Verified stock balances remained untouched: total=${fetchedItem1?.totalQuantity}, reserved=${fetchedItem1?.reservedQuantity}.`
    );

    // Verify zero new ledger entries
    const ledgerAfter = await db
      .select()
      .from(inventoryLedger)
      .where(eq(inventoryLedger.itemId, itemId1));

    recordTest(
      "Ledger Invariant - Zero Ledger Mutation on Request",
      ledgerBefore.length === ledgerAfter.length,
      `Ledger count remained identical (${ledgerBefore.length}). Submitting pending request does not produce stock ledger transactions.`
    );

    // 4. Submit multi-item borrow request
    const createResult2 = await createBorrowRequest(mockUser, {
      project: "Autonomous Flight Telemetry Node",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 7),
      items: [
        { itemId: itemId1, quantity: 2 },
        { itemId: itemId2, quantity: 3 },
      ],
    });

    requestId2 = createResult2.request.id;

    recordTest(
      "Multi-Item Request Creation",
      Boolean(
        createResult2.request &&
          createResult2.request.items.length === 2 &&
          createResult2.request.items.some((i) => i.itemId === itemId1 && i.quantity === 2) &&
          createResult2.request.items.some((i) => i.itemId === itemId2 && i.quantity === 3)
      ),
      "Successfully created multi-item borrow request for 2 distinct components."
    );

    // 5. Reject request exceeding available quantity
    let insufficientStockRejected = false;
    try {
      await createBorrowRequest(mockUser, {
        project: "Massive Drone Swarm",
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 2),
        items: [{ itemId: itemId2, quantity: 999 }], // only 5 available
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "INSUFFICIENT_STOCK") {
        insufficientStockRejected = true;
      }
    }

    recordTest(
      "Reject Request Exceeding Availability",
      insufficientStockRejected,
      "Strictly rejected borrow request where requested quantity exceeds available stock."
    );

    // 6. Reject request for archived item
    let archivedRejected = false;
    try {
      await createBorrowRequest(mockUser, {
        project: "Legacy System Retrofit",
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 2),
        items: [{ itemId: itemArchivedId, quantity: 1 }],
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "ITEM_ARCHIVED") {
        archivedRejected = true;
      }
    }

    recordTest(
      "Reject Request for Archived Item",
      archivedRejected,
      "Strictly rejected borrow request containing an archived hardware item."
    );

    // 7. Reject request with nonexistent item ID
    let nonexistentRejected = false;
    try {
      await createBorrowRequest(mockUser, {
        project: "Ghost Item Test",
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000 * 2),
        items: [{ itemId: "nonexistent-item-uuid-9999", quantity: 1 }],
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "ITEM_NOT_FOUND") {
        nonexistentRejected = true;
      }
    }

    recordTest(
      "Reject Nonexistent Item ID",
      nonexistentRejected,
      "Strictly rejected request with nonexistent item ID (HTTP 404 / ITEM_NOT_FOUND)."
    );
  } finally {
    // Cleanup test records
    try {
      if (requestId1) {
        await db.delete(inventoryRequests).where(eq(inventoryRequests.id, requestId1));
        await db
          .delete(inventoryNotificationOutbox)
          .where(eq(inventoryNotificationOutbox.referenceId, requestId1));
      }
      if (requestId2) {
        await db.delete(inventoryRequests).where(eq(inventoryRequests.id, requestId2));
        await db
          .delete(inventoryNotificationOutbox)
          .where(eq(inventoryNotificationOutbox.referenceId, requestId2));
      }
      if (itemId1) {
        await db.delete(inventoryLedger).where(eq(inventoryLedger.itemId, itemId1));
        await db.delete(inventoryItems).where(eq(inventoryItems.id, itemId1));
      }
      if (itemId2) {
        await db.delete(inventoryLedger).where(eq(inventoryLedger.itemId, itemId2));
        await db.delete(inventoryItems).where(eq(inventoryItems.id, itemId2));
      }
      if (itemArchivedId) {
        await db.delete(inventoryLedger).where(eq(inventoryLedger.itemId, itemArchivedId));
        await db.delete(inventoryItems).where(eq(inventoryItems.id, itemArchivedId));
      }
    } catch {}
  }

  const passedCount = reports.filter((r) => r.passed).length;
  console.log(
    `=== Creation & Stock Invariant Suite Summary: ${passedCount}/${reports.length} passed ===\n`
  );

  if (passedCount !== reports.length) {
    throw new Error("One or more request creation integration tests failed.");
  }
}

if (process.argv[1]?.endsWith("testBorrowRequestsIntegration.ts")) {
  runBorrowRequestsIntegrationTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Integration test runner failed:", err);
      process.exit(1);
    });
}
