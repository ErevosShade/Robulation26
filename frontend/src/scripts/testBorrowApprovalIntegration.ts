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
} from "../lib/db/schema/requests";
import { inventoryNotificationOutbox } from "../lib/db/schema/outbox";
import { createInventoryItem } from "../lib/inventory/service";
import {
  createBorrowRequest,
  approveBorrowRequest,
  rejectBorrowRequest,
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

export async function runBorrowApprovalIntegrationTests() {
  console.log("=== Starting Borrow Request Approval & Rejection Integration Suite ===");

  const timestamp = Date.now();
  const testSku1 = `APP-SKU1-${timestamp}`;
  const testSkuMultiA = `APP-SKU-MA-${timestamp}`;
  const testSkuMultiB = `APP-SKU-MB-${timestamp}`;

  let itemId1 = "";
  let itemMultiAId = "";
  let itemMultiBId = "";

  let requestId1 = "";
  let requestId2 = "";
  let requestIdReject = "";
  let requestIdMulti = "";

  const adminUser = {
    id: `admin-lead-${timestamp}`,
    name: "Commander Sarah",
    email: `sarah.admin.${timestamp}@robolution.space`,
    role: "admin",
  };

  const memberUser = {
    id: `intern-pilot-${timestamp}`,
    name: "Cadet Liam",
    email: `liam.pilot.${timestamp}@robolution.space`,
    role: "member",
  };

  try {
    // 1. Create primary test item: total 10 units
    const item1 = await createInventoryItem(
      {
        name: `High-Torque BLDC Motor ${timestamp}`,
        sku: testSku1,
        category: "Actuators",
        totalQuantity: 10,
        minimumStock: 2,
      },
      adminUser.email
    );
    itemId1 = item1.id;

    // 2. Submit pending request for 4 units
    const req1Result = await createBorrowRequest(memberUser, {
      project: "Mars Rover Drivetrain Prototype",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 5),
      items: [{ itemId: itemId1, quantity: 4 }],
    });
    requestId1 = req1Result.request.id;

    // --- TEST 1: Role Enforcement (Member cannot approve) ---
    let memberForbidden = false;
    try {
      await approveBorrowRequest(memberUser, requestId1, {
        adminNotes: "Self-approving intern request",
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "FORBIDDEN") {
        memberForbidden = true;
      }
    }
    recordTest(
      "Member Role Forbidden From Approving",
      memberForbidden,
      "Strictly rejected approval attempt by non-admin member (HTTP 403 / FORBIDDEN)."
    );

    // --- TEST 2: Successful Admin Approval & Stock Reservation ---
    const approveResult = await approveBorrowRequest(adminUser, requestId1, {
      adminNotes: "Approved for rover test bench. Return cleaned.",
    });

    const [itemAfterApproval] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemId1))
      .limit(1);

    const availableQty =
      itemAfterApproval.totalQuantity -
      itemAfterApproval.reservedQuantity -
      itemAfterApproval.checkedOutQuantity -
      itemAfterApproval.damagedQuantity;

    const reservationLedger = await db
      .select()
      .from(inventoryLedger)
      .where(eq(inventoryLedger.itemId, itemId1));

    const ledgerReservationEntry = reservationLedger.find(
      (l) =>
        l.transactionType === "reservation" &&
        ((l.metadata as any)?.requestId === requestId1 || l.reason.includes(requestId1))
    );

    const approvalSuccess =
      approveResult.request.status === "approved" &&
      approveResult.request.reviewedBy === adminUser.email &&
      Boolean(approveResult.request.reviewedAt) &&
      itemAfterApproval.reservedQuantity === 4 &&
      itemAfterApproval.totalQuantity === 10 &&
      availableQty === 6 &&
      Boolean(ledgerReservationEntry) &&
      ledgerReservationEntry?.quantityDelta === 4;

    recordTest(
      "Admin Approval & Atomic Stock Reservation",
      Boolean(approvalSuccess),
      `Status=approved, reserved=${itemAfterApproval?.reservedQuantity}, available=${availableQty}, ledger entry created with type 'reservation'.`
    );

    // --- TEST 3: Double Approval Guard ---
    let doubleApprovalPrevented = false;
    try {
      await approveBorrowRequest(adminUser, requestId1, {
        adminNotes: "Approving again",
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "REQUEST_NOT_PENDING") {
        doubleApprovalPrevented = true;
      }
    }
    recordTest(
      "Prevent Repeated Approval",
      doubleApprovalPrevented,
      "Strictly rejected approval of already approved request (HTTP 409 / REQUEST_NOT_PENDING)."
    );

    // --- TEST 4: Rollback On Stock Shortage ---
    // Only 6 units remain available. Submit request for 7 units.
    const req2Result = await createBorrowRequest(memberUser, {
      project: "Secondary Heavy Drone",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 2),
      items: [{ itemId: itemId1, quantity: 6 }], // 6 available
    });
    requestId2 = req2Result.request.id;

    // Mutate an external condition or attempt approval exceeding availability
    // First, let's create a request that asks for 7 units (which exceeds 6 available)
    // To bypass creation check, let's update request item to 7 directly in DB to simulate concurrent shortage
    await db
      .update(inventoryRequestItems)
      .set({ quantity: 7 })
      .where(eq(inventoryRequestItems.requestId, requestId2));

    let insufficientRollback = false;
    try {
      await approveBorrowRequest(adminUser, requestId2, {
        adminNotes: "Should fail due to shortage",
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "INSUFFICIENT_STOCK") {
        insufficientRollback = true;
      }
    }

    const [itemAfterFailedApproval] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemId1))
      .limit(1);

    const [req2AfterFailed] = await db
      .select()
      .from(inventoryRequests)
      .where(eq(inventoryRequests.id, requestId2))
      .limit(1);

    const rollbackValid =
      insufficientRollback &&
      itemAfterFailedApproval.reservedQuantity === 4 && // Still 4 from request 1, NOT 11
      req2AfterFailed.status === "pending"; // Request 2 remains pending

    recordTest(
      "Approval Rollback On Insufficient Stock",
      Boolean(rollbackValid),
      "Atomic rollback triggered: reservedQuantity preserved at 4, request status remains pending."
    );

    // --- TEST 5: Successful Admin Rejection & Zero Stock Movement ---
    const rejectReqResult = await createBorrowRequest(memberUser, {
      project: "Unverified Stress Test",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 1),
      items: [{ itemId: itemId1, quantity: 2 }],
    });
    requestIdReject = rejectReqResult.request.id;

    const ledgerCountBeforeReject = (
      await db
        .select()
        .from(inventoryLedger)
        .where(eq(inventoryLedger.itemId, itemId1))
    ).length;

    const rejectResult = await rejectBorrowRequest(adminUser, requestIdReject, {
      adminNotes: "Declined due to unverified high stress test conditions.",
    });

    const [itemAfterReject] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemId1))
      .limit(1);

    const ledgerCountAfterReject = (
      await db
        .select()
        .from(inventoryLedger)
        .where(eq(inventoryLedger.itemId, itemId1))
    ).length;

    const rejectionSuccess =
      rejectResult.request.status === "rejected" &&
      rejectResult.request.reviewedBy === adminUser.email &&
      rejectResult.request.adminNotes === "Declined due to unverified high stress test conditions." &&
      itemAfterReject.reservedQuantity === 4 &&
      itemAfterReject.totalQuantity === 10 &&
      ledgerCountBeforeReject === ledgerCountAfterReject;

    recordTest(
      "Admin Rejection & Zero Stock Movement",
      Boolean(rejectionSuccess),
      "Request transitioned to 'rejected', stock balances completely unaltered, zero ledger rows written."
    );

    // --- TEST 6: Prevent Rejecting Non-Pending Request ---
    let doubleRejectPrevented = false;
    try {
      await rejectBorrowRequest(adminUser, requestIdReject, {
        adminNotes: "Rejecting again",
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "REQUEST_NOT_PENDING") {
        doubleRejectPrevented = true;
      }
    }
    recordTest(
      "Prevent Rejection of Non-Pending Request",
      doubleRejectPrevented,
      "Strictly rejected attempt to reject already processed request (HTTP 409 / REQUEST_NOT_PENDING)."
    );

    // --- TEST 7: Multi-Item Atomic Reservation Failure & All-or-Nothing Rollback ---
    // Item A: 5 units available. Item B: 2 units available.
    // Request asks for: 2 of Item A, 3 of Item B (Item B only has 2).
    const itemMultiA = await createInventoryItem(
      {
        name: `IMU Sensor 6-DOF ${timestamp}`,
        sku: testSkuMultiA,
        category: "Sensors",
        totalQuantity: 5,
        minimumStock: 1,
      },
      adminUser.email
    );
    itemMultiAId = itemMultiA.id;

    const itemMultiB = await createInventoryItem(
      {
        name: `Carbon Fiber Boom 500mm ${timestamp}`,
        sku: testSkuMultiB,
        category: "Structure",
        totalQuantity: 2,
        minimumStock: 0,
      },
      adminUser.email
    );
    itemMultiBId = itemMultiB.id;

    // Create valid pending request for 2 of Item A and 2 of Item B
    const multiReqResult = await createBorrowRequest(memberUser, {
      project: "Quadcopter Airframe Integration",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 3),
      items: [
        { itemId: itemMultiAId, quantity: 2 },
        { itemId: itemMultiBId, quantity: 2 },
      ],
    });
    requestIdMulti = multiReqResult.request.id;

    // Simulate concurrent consumption: reserve 1 of item B out-of-band
    await db
      .update(inventoryItems)
      .set({ reservedQuantity: 1 })
      .where(eq(inventoryItems.id, itemMultiBId));
    // Now item B has only (2 - 1) = 1 available. The request needs 2 of Item B!

    let multiShortageRolledBack = false;
    try {
      await approveBorrowRequest(adminUser, requestIdMulti, {
        adminNotes: "Attempting multi-item approval with partial shortage",
      });
    } catch (err) {
      if (err instanceof InventoryError && err.code === "INSUFFICIENT_STOCK") {
        multiShortageRolledBack = true;
      }
    }

    const [itemMultiAAfter] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemMultiAId))
      .limit(1);

    const [itemMultiBAfter] = await db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.id, itemMultiBId))
      .limit(1);

    const multiAtomicSuccess =
      multiShortageRolledBack &&
      itemMultiAAfter.reservedQuantity === 0 && // NOT partially reserved
      itemMultiBAfter.reservedQuantity === 1; // Preserved original state

    recordTest(
      "Multi-Item All-Or-Nothing Atomic Rollback",
      Boolean(multiAtomicSuccess),
      "Item A was not partially reserved when Item B failed availability check. Zero partial reservation."
    );
  } finally {
    // Cleanup all test records
    try {
      const allReqIds = [requestId1, requestId2, requestIdReject, requestIdMulti].filter(Boolean);
      for (const rId of allReqIds) {
        await db.delete(inventoryRequests).where(eq(inventoryRequests.id, rId));
        await db
          .delete(inventoryNotificationOutbox)
          .where(eq(inventoryNotificationOutbox.referenceId, rId));
      }

      const allItemIds = [itemId1, itemMultiAId, itemMultiBId].filter(Boolean);
      for (const itId of allItemIds) {
        await db.delete(inventoryLedger).where(eq(inventoryLedger.itemId, itId));
        await db.delete(inventoryItems).where(eq(inventoryItems.id, itId));
      }
    } catch (cleanupErr) {
      console.warn("Test cleanup warning:", cleanupErr);
    }
  }

  const passedCount = reports.filter((r) => r.passed).length;
  console.log(
    `=== Approval & Rejection Integration Suite Summary: ${passedCount}/${reports.length} passed ===\n`
  );

  if (passedCount !== reports.length) {
    throw new Error("One or more approval/rejection integration tests failed.");
  }
}

if (process.argv[1]?.endsWith("testBorrowApprovalIntegration.ts")) {
  runBorrowApprovalIntegrationTests()
    .then(() => {
      console.log("All approval & rejection integration tests passed!");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Integration test runner failed:", err);
      process.exit(1);
    });
}
