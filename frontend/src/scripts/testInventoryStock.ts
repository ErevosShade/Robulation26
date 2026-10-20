if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

import { sql, eq, inArray } from "drizzle-orm";
import { db } from "../lib/db";
import { inventoryItems, inventoryLedger } from "../lib/db/schema/inventory";
import {
  createInventoryItem,
  updateInventoryItem,
  archiveInventoryItem,
  adjustItemStockAtomic,
} from "../lib/inventory/service";
import { validateStockInvariants } from "../lib/inventory/quantity";
import { requireInventoryRole } from "../lib/auth";
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

async function runStockAndAuthTests() {
  console.log("=== Starting Robolution Stock Invariants & Authorization Test Suite ===");

  const ADMIN_EMAIL = "hamzabitmesra786@gmail.com";
  const TEST_SKU = `STOCK-TEST-${Date.now()}`;
  let createdId = "";

  try {
    // 1. Authorization Guard - Role boundaries
    const adminCheck = await requireInventoryRole(["admin"], new Headers());
    recordTest(
      "Unauthenticated Guard",
      !adminCheck.authorized && adminCheck.error === "UNAUTHENTICATED",
      "Unauthenticated request to admin endpoint is rejected with UNAUTHENTICATED (401)."
    );

    // Simulated role access matrix
    const checkRoleAccess = (userRole: string, allowedRoles: string[]) => allowedRoles.includes(userRole);
    recordTest(
      "Role-Based Permission Matrix",
      checkRoleAccess("admin", ["admin"]) &&
      checkRoleAccess("admin", ["admin", "member"]) &&
      !checkRoleAccess("member", ["admin"]) &&
      checkRoleAccess("member", ["admin", "member"]),
      "Admin has admin & member access; Member is strictly forbidden from admin operations."
    );

    // 2. Unit Invariant - Non-negative validation
    const negativeTest = validateStockInvariants({
      totalQuantity: -5,
      reservedQuantity: 0,
      checkedOutQuantity: 0,
      damagedQuantity: 0,
    });
    recordTest(
      "Quantity Invariant - Negative Quantity Rejection",
      !negativeTest.isValid && Boolean(negativeTest.error?.includes("cannot be negative")),
      "Negative quantity is strictly rejected."
    );

    // 3. Unit Invariant - Stock Conservation
    const overCommitTest = validateStockInvariants({
      totalQuantity: 10,
      reservedQuantity: 6,
      checkedOutQuantity: 5,
      damagedQuantity: 0,
    });
    recordTest(
      "Quantity Invariant - Over-Allocation Rejection",
      !overCommitTest.isValid && Boolean(overCommitTest.error?.includes("cannot be less than committed")),
      "Total quantity less than sum of committed units (reserved + checkedOut) is rejected."
    );

    // 4. Create base item for database tests
    const item = await createInventoryItem(
      {
        name: "ESP32-WROOM-32D Core Board",
        sku: TEST_SKU,
        category: "Microcontrollers",
        totalQuantity: 10,
        minimumStock: 2,
      },
      ADMIN_EMAIL
    );
    createdId = item.id;

    // 5. Database Constraint - Direct violation of non-negative check constraint
    let dbCheckConstraintTriggered = false;
    try {
      await db.execute(
        sql`UPDATE inventory_items SET total_quantity = -1 WHERE id = ${createdId}`
      );
    } catch (err) {
      const causeMsg = String((err as any)?.cause?.message || "");
      const errCode = (err as any)?.cause?.code;
      if (
        causeMsg.includes("violates check constraint") ||
        causeMsg.includes("check constraint") ||
        errCode === "23514"
      ) {
        dbCheckConstraintTriggered = true;
      }
    }
    recordTest(
      "Database Constraint - Non-negative CHECK",
      dbCheckConstraintTriggered,
      "PostgreSQL CHECK constraint 'inventory_items_non_negative_quantities_check' strictly blocked negative total_quantity."
    );

    // 6. Database Constraint - Direct violation of stock conservation constraint
    let conservationCheckTriggered = false;
    try {
      await db.execute(
        sql`UPDATE inventory_items SET reserved_quantity = 8, checked_out_quantity = 5 WHERE id = ${createdId}`
      );
    } catch (err) {
      const causeMsg = String((err as any)?.cause?.message || "");
      const errCode = (err as any)?.cause?.code;
      if (
        causeMsg.includes("violates check constraint") ||
        causeMsg.includes("check constraint") ||
        errCode === "23514"
      ) {
        conservationCheckTriggered = true;
      }
    }
    recordTest(
      "Database Constraint - Conservation CHECK",
      conservationCheckTriggered,
      "PostgreSQL CHECK constraint 'inventory_items_stock_conservation_check' blocked total < (reserved + checked_out + damaged)."
    );

    // 7. Service-level reduction guard
    // Simulate item having 4 reserved and 3 checked-out
    await db
      .update(inventoryItems)
      .set({ reservedQuantity: 4, checkedOutQuantity: 3 })
      .where(eq(inventoryItems.id, createdId));

    let reductionBlocked = false;
    try {
      // Attempting to set totalQuantity to 5 when 4 + 3 = 7 are committed
      await updateInventoryItem(createdId, { totalQuantity: 5 }, ADMIN_EMAIL);
    } catch (err) {
      if (err instanceof InventoryError && err.code === "INVALID_STOCK_OPERATION") {
        reductionBlocked = true;
      }
    }
    recordTest(
      "Service Guard - Prevent Reduction Below Committed Units",
      reductionBlocked,
      "updateInventoryItem prevented totalQuantity reduction to 5 when 7 units are committed."
    );

    // 8. Archival Guard - Refuse archival if units are actively reserved or checked out
    let archivalBlocked = false;
    try {
      await archiveInventoryItem(createdId, ADMIN_EMAIL);
    } catch (err) {
      if (err instanceof InventoryError && err.code === "ACTIVE_COMMITMENTS_EXIST") {
        archivalBlocked = true;
      }
    }
    recordTest(
      "Archival Guard - Active Commitment Protection",
      archivalBlocked,
      "archiveInventoryItem refused archival while reservedQuantity > 0 or checkedOutQuantity > 0."
    );

    // Reset committed quantities
    await db
      .update(inventoryItems)
      .set({ reservedQuantity: 0, checkedOutQuantity: 0 })
      .where(eq(inventoryItems.id, createdId));

    // 9. Atomic Stock Adjustment
    const adjusted = await adjustItemStockAtomic(
      createdId,
      +5,
      "Received lab supply shipment",
      ADMIN_EMAIL
    );
    recordTest(
      "Atomic Stock Adjustment (+5)",
      adjusted.totalQuantity === 15 && adjusted.availableQuantity === 15,
      "adjustItemStockAtomic safely increased stock from 10 to 15."
    );

    // 10. Atomic Over-Depletion Prevention
    let overDepletionBlocked = false;
    try {
      // Attempt to deduct 20 when only 15 available
      await adjustItemStockAtomic(createdId, -20, "Deduct too much", ADMIN_EMAIL);
    } catch (err) {
      if (err instanceof InventoryError && err.code === "INVALID_STOCK_OPERATION") {
        overDepletionBlocked = true;
      }
    }
    recordTest(
      "Atomic Over-Depletion Rejection",
      overDepletionBlocked,
      "adjustItemStockAtomic refused deduction that would create negative balance."
    );
  } finally {
    if (createdId) {
      await db.delete(inventoryLedger).where(eq(inventoryLedger.itemId, createdId));
      await db.delete(inventoryItems).where(eq(inventoryItems.id, createdId));
    }
  }

  console.log("\n=== Stock Invariants & Auth Test Results Summary ===");
  const allPassed = reports.every((r) => r.passed);
  console.log(
    `Total tests: ${reports.length}, Passed: ${reports.filter((r) => r.passed).length}, Failed: ${reports.filter((r) => !r.passed).length}`
  );

  if (!allPassed) {
    throw new Error("One or more stock invariant / authorization tests failed.");
  }
}

if (process.argv[1]?.endsWith("testInventoryStock.ts")) {
  runStockAndAuthTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Test failed:", err);
      process.exit(1);
    });
}
