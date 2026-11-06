if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

import fs from "fs";
import path from "path";
import { generateInventoryImportPreview } from "../lib/inventory-import";

async function main() {
  console.log("=== Testing Bulk Inventory Import Preview on User Spreadsheet ===");
  const filePath = path.resolve(process.cwd(), "../inventory_consolidated_prepared_verified.xlsx");
  const fileBuffer = fs.readFileSync(filePath);

  const preview = await generateInventoryImportPreview(
    fileBuffer,
    "inventory_consolidated_prepared_verified.xlsx",
    "hamzabitmesra786@gmail.com"
  );

  console.log("Headers discovered:", preview.headersDiscovered);
  console.log("Total rows found:", preview.summary.totalRows);
  console.log("Valid new count:", preview.summary.validNewCount);
  console.log("Already exists count:", preview.summary.alreadyExistsCount);
  console.log("Duplicate candidates count:", preview.summary.duplicateCandidateCount);
  console.log("Uncertain category count:", preview.summary.uncertainCategoryCount);
  console.log("Non-standard unit count:", preview.summary.nonStandardUnitCount);
  console.log("Invalid count:", preview.summary.invalidCount);
  console.log("Total initial units to provision:", preview.summary.totalInitialUnitsToProvision);

  console.log("\nSample Rows:");
  preview.rows.slice(0, 15).forEach((r) => {
    console.log(
      `Line ${r.line}: Name="${r.name}" | FinalSKU=${r.finalSku} | OrigCat="${r.originalCategory}" -> FinalCat="${r.finalCategory}" (${r.categoryConfidence}) | Qty=${r.parsedQuantity} ${r.parsedUnit} (NonStd=${r.hasNonStandardUnit}) | Status=${r.status}`
    );
  });

  console.log("\nSample Warnings:");
  preview.warnings.slice(0, 5).forEach((w) => {
    console.log(`Line ${w.line} [${w.field}]: ${w.message}`);
  });

  if (preview.summary.totalRows !== 190) {
    throw new Error(`Expected 190 rows, got ${preview.summary.totalRows}`);
  }

  console.log("\n✅ Preview test passed successfully with 190 rows preserved!");
}

main().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
