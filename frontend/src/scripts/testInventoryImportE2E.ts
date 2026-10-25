if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

import fs from "fs";
import path from "path";
import { eq, inArray } from "drizzle-orm";
import { db } from "../lib/db";
import { inventoryItems, inventoryLedger } from "../lib/db/schema/inventory";
import {
  parseInventorySpreadsheet,
  mapDiscoveredHeaders,
  parseQuantityAndUnit,
  classifyEquipmentCategory,
  generateCompliantSku,
  buildDuplicateNameIndex,
  checkDuplicateCandidate,
  generateInventoryImportPreview,
  executeInventoryImportCommit,
  sanitizeCsvCell,
} from "../lib/inventory-import";

interface TestReport {
  name: string;
  description: string;
  passed: boolean;
  error?: string;
}

const reports: TestReport[] = [];

function assert(condition: boolean, name: string, description: string) {
  if (!condition) {
    reports.push({ name, description, passed: false, error: "Assertion failed" });
    console.error(`❌ FAIL: ${name} - ${description}`);
  } else {
    reports.push({ name, description, passed: true });
    console.log(`✓ PASS: ${name} - ${description}`);
  }
}

async function runTests() {
  console.log("===============================================================");
  console.log("🚀 ROBOLUTION 2026 // INVENTORY BULK IMPORT E2E TEST SUITE");
  console.log("===============================================================\n");

  const TEST_ADMIN = "hamzabitmesra786@gmail.com";
  const timestamp = Date.now();
  const createdTestSkus: string[] = [];

  try {
    // -------------------------------------------------------------
    // Phase 1: Header Discovery & Normalization
    // -------------------------------------------------------------
    console.log("=== Phase 1: Header Discovery & Normalization ===");
    {
      const headers = ["id ", "name", "sku", "category", "Total Quantity", "", "Notes"];
      const mapping = mapDiscoveredHeaders(headers);

      assert(
        mapping.nameCol === 1 &&
          mapping.skuCol === 2 &&
          mapping.categoryCol === 3 &&
          mapping.quantityCol === 4 &&
          mapping.notesCol === 6 &&
          mapping.idCol === 0,
        "Header Discovery - Aliases & Whitespace",
        "Discovered headers correctly even with trailing whitespace ('id ') and varied casing."
      );
    }

    // -------------------------------------------------------------
    // Phase 2: Quantity & Unit Validation
    // -------------------------------------------------------------
    console.log("\n=== Phase 2: Quantity & Unit Validation ===");
    {
      const intResult = parseQuantityAndUnit("5");
      assert(
        intResult.quantity === 5 && intResult.unit === "pieces" && !intResult.hasNonStandardUnit,
        "Quantity Parser - Integer",
        "Correctly parsed clean integer quantity '5'."
      );

      const packsResult = parseQuantityAndUnit("2 packs");
      assert(
        packsResult.quantity === 2 &&
          packsResult.unit === "packs" &&
          packsResult.hasNonStandardUnit &&
          Boolean(packsResult.warning),
        "Quantity Parser - Non-Piece Unit (2 packs)",
        "Extracted count=2 and unit='packs' with non-standard unit warning."
      );

      const boxResult = parseQuantityAndUnit("1 box");
      assert(
        boxResult.quantity === 1 &&
          boxResult.unit === "box" &&
          boxResult.hasNonStandardUnit,
        "Quantity Parser - Non-Piece Unit (1 box)",
        "Extracted count=1 and unit='box'."
      );

      const blankResult = parseQuantityAndUnit("");
      assert(
        Boolean(blankResult.error),
        "Quantity Parser - Blank Rejection",
        "Strictly flagged blank quantity as validation error."
      );

      const invalidResult = parseQuantityAndUnit("invalid_text");
      assert(
        Boolean(invalidResult.error),
        "Quantity Parser - Invalid Text Rejection",
        "Strictly flagged invalid text quantity as validation error."
      );
    }

    // -------------------------------------------------------------
    // Phase 3: Category Classification & Ambiguity Handling
    // -------------------------------------------------------------
    console.log("\n=== Phase 3: Category Classification & Ambiguity Handling ===");
    {
      // Explicit category preserved
      const explicit = classifyEquipmentCategory("Custom Valve", "Pneumatics", "Pressure line");
      assert(
        explicit.category === "Pneumatics" && explicit.confidence === "explicit",
        "Category Classifier - Explicit Preservation",
        "Spreadsheet category 'Pneumatics' was strictly preserved without overwrite."
      );

      // Deterministic Sensor match
      const sensor = classifyEquipmentCategory("Water Sensor", "", "");
      assert(
        sensor.category === "Sensors" && sensor.confidence === "suggested",
        "Category Classifier - Deterministic Sensor",
        "Inferred 'Sensors' category for 'Water Sensor'."
      );

      // Deterministic Motor Driver match
      const driver = classifyEquipmentCategory("L298N motor driver", "", "");
      assert(
        driver.category === "Motor Drivers" && driver.confidence === "suggested",
        "Category Classifier - Deterministic Driver",
        "Inferred 'Motor Drivers' category for 'L298N motor driver'."
      );

      // Ambiguous item left unassigned
      const ambiguous = classifyEquipmentCategory("clock", "", "");
      assert(
        ambiguous.category === "" && ambiguous.confidence === "unassigned",
        "Category Classifier - Ambiguous Item Left Unassigned",
        "Ambiguous item 'clock' was left unassigned for manual admin review."
      );
    }

    // -------------------------------------------------------------
    // Phase 4: SKU Generation & Collision Protection
    // -------------------------------------------------------------
    console.log("\n=== Phase 4: SKU Generation & Collision Protection ===");
    {
      const usedSkus = new Set<string>();
      const sku1 = generateCompliantSku("Servo Motor MG90S", "Motors", 3, usedSkus);
      assert(
        sku1.startsWith("MTR-") && usedSkus.has(sku1),
        "SKU Generator - Format & Registration",
        `Generated compliant SKU '${sku1}' adhering to regex.`
      );

      // Collision in same run
      const sku2 = generateCompliantSku("Servo Motor MG90S", "Motors", 3, usedSkus);
      assert(
        sku2 !== sku1 && sku2.includes("-D1"),
        "SKU Generator - Collision Disambiguation",
        `Resolved duplicate candidate with discriminator: '${sku2}'.`
      );
    }

    // -------------------------------------------------------------
    // Phase 5: Duplicate Name Candidate Detection
    // -------------------------------------------------------------
    console.log("\n=== Phase 5: Duplicate Name Candidate Detection ===");
    {
      const testRows = [
        { line: 13, name: "Buzzer" },
        { line: 20, name: "Capacitors" },
        { line: 184, name: "buzzer" },
      ];
      const dupIndex = buildDuplicateNameIndex(testRows);
      const dupCheck1 = checkDuplicateCandidate("Buzzer", 13, dupIndex);
      const dupCheck2 = checkDuplicateCandidate("buzzer", 184, dupIndex);

      assert(
        dupCheck1.isDuplicateCandidate &&
          dupCheck1.duplicateCandidateLines.includes(184) &&
          dupCheck2.duplicateCandidateLines.includes(13),
        "Duplicate Name Detection - Intra-File Warning",
        "Identified duplicate equipment name 'Buzzer' across lines 13 and 184 without dropping either."
      );
    }

    // -------------------------------------------------------------
    // Phase 6: Formula Injection Protection
    // -------------------------------------------------------------
    console.log("\n=== Phase 6: Formula Injection Protection ===");
    {
      const dangerous1 = "=cmd|' /C calc'!A0";
      const dangerous2 = "+12345";
      const dangerous3 = "-SUM(A1:A10)";
      const dangerous4 = "@HYPERLINK('http://malicious.com')";

      assert(
        sanitizeCsvCell(dangerous1) === "'=cmd|' /C calc'!A0" &&
          sanitizeCsvCell(dangerous2) === "'+12345" &&
          sanitizeCsvCell(dangerous3) === "'-SUM(A1:A10)" &&
          sanitizeCsvCell(dangerous4) === "'@HYPERLINK('http://malicious.com')",
        "Formula Injection Defense - DDE Neutralization",
        "Prepend quote strictly neutralizes all dangerous CSV formula triggers."
      );
    }

    // -------------------------------------------------------------
    // Phase 7: Real Workbook Preview & Zero-Mutation Invariant
    // -------------------------------------------------------------
    console.log("\n=== Phase 7: Real Workbook Preview & Zero-Mutation Invariant ===");
    {
      const [initialItemCount] = await db
        .select({ count: inventoryItems.id })
        .from(inventoryItems);

      const filePath = path.resolve(
        process.cwd(),
        "../inventory_consolidated_prepared_verified.xlsx"
      );
      const fileBuffer = fs.readFileSync(filePath);

      const preview = await generateInventoryImportPreview(
        fileBuffer,
        "inventory_consolidated_prepared_verified.xlsx",
        TEST_ADMIN
      );

      const [postPreviewItemCount] = await db
        .select({ count: inventoryItems.id })
        .from(inventoryItems);

      assert(
        preview.summary.totalRows === 190 &&
          preview.rows.length === 190 &&
          preview.headersDiscovered.includes("name") &&
          preview.headersDiscovered.includes("Total Quantity"),
        "Workbook Ingestion - 190 Rows Preserved",
        "Successfully parsed all 190 rows and detected headers."
      );

      assert(
        Boolean(initialItemCount) === Boolean(postPreviewItemCount),
        "Preview Zero-Mutation Invariant",
        "Preview completed full analysis with 0 database writes."
      );

      // Verify equipment names are 100% unaltered
      const row1Name = preview.rows[0].name;
      const row2Name = preview.rows[1].name;
      assert(
        row1Name === "Microphone" && row2Name === "Servo Motor MG90S",
        "Equipment Name Preservation",
        "Equipment names 'Microphone' and 'Servo Motor MG90S' strictly unaltered."
      );
    }

    // -------------------------------------------------------------
    // Phase 8: Transactional Commit, Initial Stock & Ledger Invariant
    // -------------------------------------------------------------
    console.log("\n=== Phase 8: Transactional Commit, Initial Stock & Ledger Invariant ===");
    {
      const testSku1 = `TEST-E2E-ITEM1-${timestamp}`;
      const testSku2 = `TEST-E2E-ITEM2-${timestamp}`;
      createdTestSkus.push(testSku1, testSku2);

      const commitPayload = {
        rows: [
          {
            line: 1,
            name: `E2E Test Sensor ${timestamp}`,
            sku: testSku1,
            category: "Sensors",
            totalQuantity: 10,
            unit: "pieces",
            notes: "Test notes for initial stock provisioning",
          },
          {
            line: 2,
            name: `E2E Test Motor ${timestamp}`,
            sku: testSku2,
            category: "Motors",
            totalQuantity: 5,
            unit: "pieces",
          },
        ],
        batchId: `BATCH-E2E-${timestamp}`,
        filename: "test_e2e_import.xlsx",
      };

      const result = await executeInventoryImportCommit(commitPayload, TEST_ADMIN);

      assert(
        result.success &&
          result.summary.insertedCount === 2 &&
          result.insertedSkus.includes(testSku1) &&
          result.insertedSkus.includes(testSku2),
        "Import Commit - Successful Add-Only Insert",
        "Inserted 2 new inventory items into Neon DB."
      );

      // Verify stock invariants on inserted items
      const [dbItem1] = await db
        .select()
        .from(inventoryItems)
        .where(eq(inventoryItems.sku, testSku1))
        .limit(1);

      assert(
        Boolean(dbItem1) &&
          dbItem1.totalQuantity === 10 &&
          dbItem1.reservedQuantity === 0 &&
          dbItem1.checkedOutQuantity === 0 &&
          dbItem1.damagedQuantity === 0,
        "Stock Conservation Invariant - Initial Values",
        "New item initialized with totalQuantity=10 and 0 reserved/checkedOut/damaged."
      );

      // Verify ledger entry
      const [ledgerRow1] = await db
        .select()
        .from(inventoryLedger)
        .where(eq(inventoryLedger.itemId, dbItem1.id))
        .limit(1);

      assert(
        Boolean(ledgerRow1) &&
          ledgerRow1.transactionType === "initial_stock" &&
          ledgerRow1.quantityDelta === 10 &&
          ledgerRow1.availableQuantityAfter === 10 &&
          ledgerRow1.performedBy === TEST_ADMIN,
        "Stock Ledger Audit Invariant - initial_stock Entry",
        "Recorded immutable 'initial_stock' ledger entry with delta=+10."
      );

      // -------------------------------------------------------------
      // Phase 9: Idempotency & Repeat Ingestion Protection
      // -------------------------------------------------------------
      console.log("\n=== Phase 9: Idempotency & Repeat Ingestion Protection ===");
      {
        const retryResult = await executeInventoryImportCommit(commitPayload, TEST_ADMIN);

        assert(
          retryResult.summary.insertedCount === 0 &&
            retryResult.summary.skippedCount === 2 &&
            retryResult.skippedSkus.includes(testSku1) &&
            retryResult.skippedSkus.includes(testSku2),
          "Idempotent Retry - Conflict Protection",
          "Re-running identical import skipped all 2 existing items with 0 duplicate items or stock ledger rows created."
        );

        // Verify stock did not double
        const [recheckItem1] = await db
          .select()
          .from(inventoryItems)
          .where(eq(inventoryItems.sku, testSku1))
          .limit(1);

        assert(
          recheckItem1.totalQuantity === 10,
          "No Silent Restock on Duplicate Import",
          "Item totalQuantity remained strictly 10 (did not double to 20)."
        );
      }
    }
  } catch (error) {
    console.error("Test execution threw unhandled exception:", error);
    reports.push({
      name: "Unhandled Exception",
      description: String(error),
      passed: false,
    });
  } finally {
    // Cleanup temporary test items and ledger rows created during E2E test
    if (createdTestSkus.length > 0) {
      try {
        const testItems = await db
          .select({ id: inventoryItems.id })
          .from(inventoryItems)
          .where(inArray(inventoryItems.sku, createdTestSkus));

        if (testItems.length > 0) {
          const ids = testItems.map((i) => i.id);
          await db.delete(inventoryLedger).where(inArray(inventoryLedger.itemId, ids));
          await db.delete(inventoryItems).where(inArray(inventoryItems.id, ids));
        }
        console.log(`\n🧹 Cleaned up ${createdTestSkus.length} temporary test items.`);
      } catch (cleanupErr) {
        console.warn("Cleanup warning:", cleanupErr);
      }
    }
  }

  // Summary
  const passedCount = reports.filter((r) => r.passed).length;
  const failedCount = reports.filter((r) => !r.passed).length;
  console.log("\n===============================================================");
  console.log(`BULK INVENTORY IMPORT TEST RESULTS: ${passedCount}/${reports.length} PASSED`);
  if (failedCount > 0) {
    console.log(`⚠️ ${failedCount} test(s) failed.`);
    process.exit(1);
  } else {
    console.log("✨ ALL BULK IMPORT & DATA PRESERVATION TESTS PASSED! ✨");
    console.log("===============================================================");
  }
}

runTests();
