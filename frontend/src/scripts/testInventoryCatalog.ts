if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

import { eq, inArray } from "drizzle-orm";
import { db } from "../lib/db";
import { inventoryItems, inventoryLedger } from "../lib/db/schema/inventory";
import {
  createInventoryItem,
  listInventoryItems,
  getItemById,
  updateInventoryItem,
  archiveInventoryItem,
} from "../lib/inventory/service";
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

async function runCatalogTests() {
  console.log("=== Starting Robolution Inventory Catalog & CRUD Test Suite ===");

  const ADMIN_EMAIL = "hamzabitmesra786@gmail.com";
  const TEST_SKU_1 = `TEST-MCU-${Date.now()}`;
  const TEST_SKU_2 = `TEST-SENS-${Date.now()}`;
  let createdId1 = "";
  let createdId2 = "";

  try {
    // 1. Create inventory item with full metadata and initial stock
    const item1 = await createInventoryItem(
      {
        name: "STM32F401 BlackPill",
        sku: TEST_SKU_1,
        category: "Microcontrollers",
        description: "ARM Cortex-M4 development board with USB-C.",
        tags: ["arm", "stm32", "cortex-m4"],
        locationRoom: "Lab 204",
        locationCabinet: "Cabinet A",
        locationShelf: "Shelf 1",
        locationBin: "Bin 3",
        unitCost: "350.00",
        currency: "INR",
        totalQuantity: 10,
        minimumStock: 2,
        consumable: false,
        internalNotes: "Vendor: Robu.in batch #42",
      },
      ADMIN_EMAIL
    );

    createdId1 = item1.id;
    recordTest(
      "Item Creation with Metadata & Initial Stock",
      Boolean(
        item1.id &&
        item1.sku === TEST_SKU_1 &&
        item1.availableQuantity === 10 &&
        item1.status === "in_stock" &&
        item1.internalNotes === "Vendor: Robu.in batch #42"
      ),
      `Successfully created item '${item1.name}' with availableQuantity=10 and in_stock status.`
    );

    // 2. Initial stock ledger entry verification
    const [ledgerEntry] = await db
      .select()
      .from(inventoryLedger)
      .where(eq(inventoryLedger.itemId, createdId1))
      .limit(1);

    recordTest(
      "Initial Stock Ledger Audit",
      Boolean(
        ledgerEntry &&
        ledgerEntry.transactionType === "initial_stock" &&
        ledgerEntry.quantityDelta === 10 &&
        ledgerEntry.performedBy === ADMIN_EMAIL
      ),
      `Verified initial_stock ledger entry created with delta=+10 by ${ADMIN_EMAIL}.`
    );

    // 3. Duplicate SKU rejection
    let duplicateRejected = false;
    try {
      await createInventoryItem(
        {
          name: "Duplicate Board",
          sku: TEST_SKU_1,
          category: "Microcontrollers",
        },
        ADMIN_EMAIL
      );
    } catch (err) {
      if (err instanceof InventoryError && err.code === "DUPLICATE_SKU" && err.statusCode === 409) {
        duplicateRejected = true;
      }
    }

    recordTest(
      "Duplicate SKU Prevention",
      duplicateRejected,
      "Attempt to create item with existing SKU strictly rejected with 409 DUPLICATE_SKU."
    );

    // 4. Create second item (Low Stock)
    const item2 = await createInventoryItem(
      {
        name: "VL53L0X ToF Laser Sensor",
        sku: TEST_SKU_2,
        category: "Sensors",
        description: "Time-of-flight distance sensor up to 2m.",
        tags: ["sensor", "laser", "tof", "i2c"],
        totalQuantity: 1,
        minimumStock: 2,
      },
      ADMIN_EMAIL
    );

    createdId2 = item2.id;
    recordTest(
      "Low Stock Status Derivation",
      item2.status === "low_stock" && item2.availableQuantity === 1,
      `Item with totalQuantity=1 and minimumStock=2 correctly derived status='low_stock'.`
    );

    // 5. Catalog listing and pagination
    const catalog = await listInventoryItems({ page: 1, limit: 10 }, true);
    recordTest(
      "Catalog Pagination",
      catalog.items.length >= 2 &&
      catalog.pagination.page === 1 &&
      catalog.pagination.totalItems >= 2,
      `Retrieved paginated catalog: ${catalog.items.length} items (total: ${catalog.pagination.totalItems}).`
    );

    // 6. Name and SKU search
    const searchResult = await listInventoryItems(
      { page: 1, limit: 10, search: "BlackPill" },
      true
    );
    recordTest(
      "Catalog Search",
      searchResult.items.some((i) => i.id === createdId1) &&
      !searchResult.items.some((i) => i.id === createdId2),
      "Search by 'BlackPill' accurately isolates target item."
    );

    // 7. Category filtering
    const categoryResult = await listInventoryItems(
      { page: 1, limit: 10, category: "Sensors" },
      true
    );
    recordTest(
      "Category Filtering",
      categoryResult.items.some((i) => i.id === createdId2) &&
      !categoryResult.items.some((i) => i.id === createdId1),
      "Filtering by category='Sensors' matches sensor item and excludes microcontrollers."
    );

    // 8. Status filtering
    const lowStockResult = await listInventoryItems(
      { page: 1, limit: 10, status: "low_stock" },
      true
    );
    recordTest(
      "Status Filtering (low_stock)",
      lowStockResult.items.some((i) => i.id === createdId2) &&
      !lowStockResult.items.some((i) => i.id === createdId1),
      "Filtering by status='low_stock' matches low stock items."
    );

    // 9. Single item retrieval by ID
    const retrieved = await getItemById(createdId1, true);
    recordTest(
      "Single Item Detail Retrieval",
      Boolean(retrieved && retrieved.id === createdId1 && retrieved.sku === TEST_SKU_1),
      `Successfully retrieved details for item ${createdId1}.`
    );

    // 10. Non-admin internalNotes sanitization
    const memberView = await getItemById(createdId1, false);
    recordTest(
      "Non-Admin Field Sanitization",
      Boolean(memberView && !("internalNotes" in memberView)),
      "internalNotes is strictly stripped from item details for non-admin viewers."
    );

    // 11. Item updates
    const updated = await updateInventoryItem(
      createdId1,
      {
        name: "STM32F401 BlackPill Pro",
        locationShelf: "Shelf 2",
        totalQuantity: 15, // +5 delta
      },
      ADMIN_EMAIL
    );

    recordTest(
      "Item Update & Stock Adjustment",
      updated.name === "STM32F401 BlackPill Pro" &&
      updated.locationShelf === "Shelf 2" &&
      updated.totalQuantity === 15 &&
      updated.availableQuantity === 15,
      "Updated item title, shelf location, and adjusted total holdings from 10 to 15."
    );

    // 12. Safe archival
    const archived = await archiveInventoryItem(createdId2, ADMIN_EMAIL, "Obsolete sensor batch");
    recordTest(
      "Safe Item Archival",
      archived.archived === true && archived.active === false && archived.status === "archived",
      "Item safely soft-deleted/archived with status='archived'."
    );

    // 13. Archived items hidden from non-admins
    const memberArchivedView = await getItemById(createdId2, false);
    recordTest(
      "Archived Item Hidden from Non-Admins",
      memberArchivedView === null,
      "Archived item returns 404 (null) to non-admin member queries."
    );
  } finally {
    // 14. Cleanup test fixtures
    const testIds = [createdId1, createdId2].filter(Boolean);
    if (testIds.length > 0) {
      await db.delete(inventoryLedger).where(inArray(inventoryLedger.itemId, testIds));
      await db.delete(inventoryItems).where(inArray(inventoryItems.id, testIds));
    }
  }

  console.log("\n=== Inventory Catalog Test Results Summary ===");
  const allPassed = reports.every((r) => r.passed);
  console.log(
    `Total tests: ${reports.length}, Passed: ${reports.filter((r) => r.passed).length}, Failed: ${reports.filter((r) => !r.passed).length}`
  );

  if (!allPassed) {
    throw new Error("One or more inventory catalog unit/integration tests failed.");
  }
}

if (process.argv[1]?.endsWith("testInventoryCatalog.ts")) {
  runCatalogTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Test failed:", err);
      process.exit(1);
    });
}
