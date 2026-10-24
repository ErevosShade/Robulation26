if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

process.env.TELEGRAM_MOCK_MODE = "true";

import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { inventoryItems, inventoryLedger } from "../lib/db/schema/inventory";
import {
  inventoryRequests,
  inventoryRequestItems,
  inventoryReturns,
  inventoryReturnItems,
} from "../lib/db/schema/requests";
import { inventoryNotificationOutbox } from "../lib/db/schema/outbox";
import { createInventoryItem } from "../lib/inventory/service";
import {
  createBorrowRequest,
  approveBorrowRequest,
  collectBorrowRequest,
  returnBorrowRequest,
  getBorrowRequestReturns,
} from "../lib/inventory/requests";
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

export async function runBorrowCollectionReturnIntegrationTests() {
  console.log("=== Starting Borrow Request Collection & Return Integration Suite ===");

  const timestamp = Date.now();
  const testSku1 = `LIFECYCLE-SKU1-${timestamp}`;
  const testSku2 = `LIFECYCLE-SKU2-${timestamp}`;

  let itemId1 = "";
  let itemId2 = "";
  let requestId = "";

  const adminUser = {
    id: `admin-${timestamp}`,
    name: "Commander Sarah",
    email: `sarah.admin.${timestamp}@robolution.space`,
    role: "admin",
  };

  const memberA = {
    id: `member-a-${timestamp}`,
    name: "Alex Vance",
    email: `alex.vance.${timestamp}@robolution.space`,
    role: "member",
  };

  const memberB = {
    id: `member-b-${timestamp}`,
    name: "Unauthorized Pilot",
    email: `intruder.${timestamp}@robolution.space`,
    role: "member",
  };

  try {
    // 1. Create items
    const item1 = await createInventoryItem(
      {
        name: `Telemetry Transceiver ${timestamp}`,
        sku: testSku1,
        category: "Communication",
        totalQuantity: 10,
        minimumStock: 2,
      },
      adminUser.email
    );
    itemId1 = item1.id;

    const item2 = await createInventoryItem(
      {
        name: `LiDAR Puck Sensor ${timestamp}`,
        sku: testSku2,
        category: "Sensors",
        totalQuantity: 5,
        minimumStock: 1,
      },
      adminUser.email
    );
    itemId2 = item2.id;

    // 2. Submit borrow request: 4 units of Item 1, 2 units of Item 2
    const reqResult = await createBorrowRequest(memberA, {
      project: "Mars Rover Telemetry and Obstacle Avoidance",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 5),
      items: [
        { itemId: itemId1, quantity: 4 },
        { itemId: itemId2, quantity: 2 },
      ],
    });
    requestId = reqResult.request.id;

    // 3. Admin approves request
    await approveBorrowRequest(adminUser, requestId, {
      adminNotes: "Approved for rover integration bench",
    });

    const [item1AfterApprove] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemId1))
      .limit(1);

    const [item2AfterApprove] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemId2))
      .limit(1);

    const approveStockValid =
      item1AfterApprove.reservedQuantity === 4 &&
      item1AfterApprove.totalQuantity === 10 &&
      item2AfterApprove.reservedQuantity === 2 &&
      item2AfterApprove.totalQuantity === 5;

    recordTest(
      "Approval Stock Invariant",
      Boolean(approveStockValid),
      "Item 1 reserved=4, Item 2 reserved=2. Stock conservation strictly preserved."
    );

    // --- TEST 1: Collection Authorization Guard (Member B cannot collect Member A's request) ---
    let memberBCollectBlocked = false;
    try {
      await collectBorrowRequest(memberB, requestId, {
        notes: "Intruder attempting collection",
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "FORBIDDEN") {
        memberBCollectBlocked = true;
      }
    }
    recordTest(
      "Collection Ownership Guard",
      memberBCollectBlocked,
      "Unauthorized member B was strictly denied from collecting member A's approved hardware (HTTP 403 / FORBIDDEN)."
    );

    // --- TEST 2: Successful Collection Confirmation & Stock Transition ---
    const collectResult = await collectBorrowRequest(memberA, requestId, {
      notes: "Retrieved by Alex from Storage Bay 2",
    });

    const [item1AfterCollect] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemId1))
      .limit(1);

    const [item2AfterCollect] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemId2))
      .limit(1);

    const item1Available =
      item1AfterCollect.totalQuantity -
      (item1AfterCollect.reservedQuantity +
        item1AfterCollect.checkedOutQuantity +
        item1AfterCollect.damagedQuantity);

    const item2Available =
      item2AfterCollect.totalQuantity -
      (item2AfterCollect.reservedQuantity +
        item2AfterCollect.checkedOutQuantity +
        item2AfterCollect.damagedQuantity);

    const collectStockValid =
      collectResult.request.status === "collected" &&
      collectResult.request.collectedBy === memberA.email &&
      Boolean(collectResult.request.collectedAt) &&
      item1AfterCollect.reservedQuantity === 0 &&
      item1AfterCollect.checkedOutQuantity === 4 &&
      item1Available === 6 &&
      item2AfterCollect.reservedQuantity === 0 &&
      item2AfterCollect.checkedOutQuantity === 2 &&
      item2Available === 3;

    recordTest(
      "Collection Confirmation & Stock Transition",
      Boolean(collectStockValid),
      "Reserved decreased to 0, Checked-out increased (Item 1: 4, Item 2: 2). Available balances unchanged."
    );

    // Verify stock ledger entry for checkout
    const ledgerEntries = await db
      .select()
      .from(inventoryLedger)
      .where(eq(inventoryLedger.itemId, itemId1));

    const checkoutLedger = ledgerEntries.find((l) => l.transactionType === "checkout");
    recordTest(
      "Collection Ledger Audit Entry",
      Boolean(checkoutLedger && checkoutLedger.quantityDelta === 4),
      "Immutable ledger entry created with transaction_type='checkout' and quantity_delta=4."
    );

    // --- TEST 3: Duplicate Collection Prevention (Idempotent / Conflict Guard) ---
    let repeatCollectBlocked = false;
    try {
      await collectBorrowRequest(memberA, requestId, {
        notes: "Collecting again",
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "REQUEST_ALREADY_COLLECTED") {
        repeatCollectBlocked = true;
      }
    }
    recordTest(
      "Prevent Duplicate Collection",
      repeatCollectBlocked,
      "Strictly rejected repeat collection attempt for already collected hardware (HTTP 409 / REQUEST_ALREADY_COLLECTED)."
    );

    // --- TEST 4: Return Ownership Guard (Member B cannot return Member A's hardware) ---
    let memberBReturnBlocked = false;
    try {
      await returnBorrowRequest(memberB, requestId, {
        items: [{ itemId: itemId1, quantity: 1, condition: "good" }],
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "FORBIDDEN") {
        memberBReturnBlocked = true;
      }
    }
    recordTest(
      "Return Ownership Guard",
      memberBReturnBlocked,
      "Unauthorized member B was strictly denied from recording returns for member A's request (HTTP 403 / FORBIDDEN)."
    );

    // --- TEST 5: Partial Return - Good Condition ---
    // Return 2 out of 4 units of Item 1 in good condition
    const partialReturn1 = await returnBorrowRequest(memberA, requestId, {
      notes: "First batch return: 2 units tested and operational",
      items: [{ itemId: itemId1, quantity: 2, condition: "good", notes: "Working fine" }],
    });

    const [item1AfterPartReturn] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemId1))
      .limit(1);

    const available1AfterGoodReturn =
      item1AfterPartReturn.totalQuantity -
      (item1AfterPartReturn.reservedQuantity +
        item1AfterPartReturn.checkedOutQuantity +
        item1AfterPartReturn.damagedQuantity);

    const goodReturnStockValid =
      partialReturn1.request.status === "partially_returned" &&
      item1AfterPartReturn.checkedOutQuantity === 2 &&
      available1AfterGoodReturn === 8; // Available increased from 6 to 8!

    recordTest(
      "Partial Return - Good Condition Stock Credit",
      Boolean(goodReturnStockValid),
      "Status transitioned to 'partially_returned'. CheckedOut=2, Available increased to 8."
    );

    // --- TEST 6: Over-Return Prevention Guard ---
    // Item 1 only has 2 units remaining outstanding (4 - 2 = 2). Attempt to return 3 units.
    let overReturnBlocked = false;
    try {
      await returnBorrowRequest(memberA, requestId, {
        items: [{ itemId: itemId1, quantity: 3, condition: "good" }],
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "RETURN_QUANTITY_EXCEEDED") {
        overReturnBlocked = true;
      }
    }
    recordTest(
      "Prevent Return Exceeding Outstanding Quantity",
      overReturnBlocked,
      "Strictly rejected return of 3 units when only 2 units are outstanding (HTTP 400 / RETURN_QUANTITY_EXCEEDED)."
    );

    // --- TEST 7: Damaged Return - Does NOT Increase Available Stock ---
    // Return 1 unit of Item 1 in damaged condition
    const partialReturn2 = await returnBorrowRequest(memberA, requestId, {
      notes: "Damaged hardware return",
      items: [
        {
          itemId: itemId1,
          quantity: 1,
          condition: "damaged",
          notes: "Burned RF amplifier chip",
        },
      ],
    });

    const [item1AfterDamagedReturn] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemId1))
      .limit(1);

    const available1AfterDamaged =
      item1AfterDamagedReturn.totalQuantity -
      (item1AfterDamagedReturn.reservedQuantity +
        item1AfterDamagedReturn.checkedOutQuantity +
        item1AfterDamagedReturn.damagedQuantity);

    const damagedReturnStockValid =
      partialReturn2.request.status === "partially_returned" &&
      item1AfterDamagedReturn.checkedOutQuantity === 1 &&
      item1AfterDamagedReturn.damagedQuantity === 1 &&
      available1AfterDamaged === 8; // Available remained 8, did NOT increase!

    recordTest(
      "Damaged Return - Quarantined Stock Invariant",
      Boolean(damagedReturnStockValid),
      "CheckedOut decreased to 1, Damaged increased to 1, Available remained 8 (strictly not made available)."
    );

    // Verify damaged ledger entry
    const item1Ledger = await db
      .select()
      .from(inventoryLedger)
      .where(eq(inventoryLedger.itemId, itemId1));

    const damageLedger = item1Ledger.find((l) => l.transactionType === "damage");
    recordTest(
      "Damaged Stock Ledger Audit Entry",
      Boolean(damageLedger && damageLedger.quantityDelta === 1),
      "Immutable ledger entry created with transaction_type='damage' and quantity_delta=1."
    );

    // --- TEST 8: Full Return - Final Reconciliation ---
    // Outstanding remaining:
    // Item 1: 1 unit outstanding
    // Item 2: 2 units outstanding
    const finalReturn = await returnBorrowRequest(memberA, requestId, {
      notes: "Final return of all remaining items",
      items: [
        { itemId: itemId1, quantity: 1, condition: "good" },
        { itemId: itemId2, quantity: 2, condition: "good" },
      ],
    });

    const [item1Final] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemId1))
      .limit(1);

    const [item2Final] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemId2))
      .limit(1);

    const finalReturnValid =
      finalReturn.request.status === "returned" &&
      item1Final.checkedOutQuantity === 0 &&
      item1Final.damagedQuantity === 1 &&
      item1Final.totalQuantity === 10 &&
      item2Final.checkedOutQuantity === 0 &&
      item2Final.damagedQuantity === 0 &&
      item2Final.totalQuantity === 5;

    recordTest(
      "Final Return - Lifecycle Completed Status",
      Boolean(finalReturnValid),
      "Request status transitioned to 'returned' (completed). All checkedOut units returned to 0."
    );

    // --- TEST 9: Prevent Returns on Completed Request ---
    let completedReturnBlocked = false;
    try {
      await returnBorrowRequest(memberA, requestId, {
        items: [{ itemId: itemId1, quantity: 1, condition: "good" }],
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "REQUEST_ALREADY_RETURNED") {
        completedReturnBlocked = true;
      }
    }
    recordTest(
      "Prevent Return on Completed Request",
      completedReturnBlocked,
      "Strictly rejected return submission against request that is already fully returned (HTTP 409 / REQUEST_ALREADY_RETURNED)."
    );

    // --- TEST 10: Return History Audit Inspection ---
    const returnHistory = await getBorrowRequestReturns(memberA, requestId);
    const hasHistory =
      returnHistory.length === 3 &&
      returnHistory.some((r) => r.items.some((i) => i.condition === "damaged"));

    recordTest(
      "Return History Audit Trail Query",
      Boolean(hasHistory),
      "Successfully retrieved all 3 return sessions with item breakdown, condition flags, and timestamps."
    );
  } finally {
    // Cleanup all test records
    try {
      if (requestId) {
        // Delete return items and returns
        const returns = await db
          .select()
          .from(inventoryReturns)
          .where(eq(inventoryReturns.requestId, requestId));
        for (const ret of returns) {
          await db.delete(inventoryReturnItems).where(eq(inventoryReturnItems.returnId, ret.id));
        }
        await db.delete(inventoryReturns).where(eq(inventoryReturns.requestId, requestId));

        // Delete request items and request
        await db.delete(inventoryRequestItems).where(eq(inventoryRequestItems.requestId, requestId));
        await db.delete(inventoryRequests).where(eq(inventoryRequests.id, requestId));
        await db
          .delete(inventoryNotificationOutbox)
          .where(eq(inventoryNotificationOutbox.referenceId, requestId));
      }

      if (itemId1) {
        await db.delete(inventoryLedger).where(eq(inventoryLedger.itemId, itemId1));
        await db.delete(inventoryItems).where(eq(inventoryItems.id, itemId1));
      }
      if (itemId2) {
        await db.delete(inventoryLedger).where(eq(inventoryLedger.itemId, itemId2));
        await db.delete(inventoryItems).where(eq(inventoryItems.id, itemId2));
      }
    } catch (cleanupErr) {
      console.warn("Integration test cleanup warning:", cleanupErr);
    }
  }

  const passedCount = reports.filter((r) => r.passed).length;
  console.log(
    `=== Collection & Return Integration Suite Summary: ${passedCount}/${reports.length} passed ===\n`
  );

  if (passedCount !== reports.length) {
    throw new Error("One or more collection/return integration tests failed.");
  }
}

if (process.argv[1]?.endsWith("testBorrowCollectionReturnIntegration.ts")) {
  runBorrowCollectionReturnIntegrationTests()
    .then(() => {
      console.log("All collection & return integration tests passed!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Integration test runner failed:", err);
      process.exit(1);
    });
}
