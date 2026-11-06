import { parseInventorySpreadsheet, type ParseSpreadsheetOptions } from "./parser";
import { parseQuantityAndUnit } from "./normalizers";
import { classifyEquipmentCategory } from "./classifier";
import { generateCompliantSku } from "./sku-generator";
import {
  buildDuplicateNameIndex,
  checkDuplicateCandidate,
} from "./duplicate-detector";
import { checkExistingDbInventory } from "./db-checker";
import { skuRegex } from "@/lib/inventory/validation";
import type {
  ValidatedImportRow,
  ImportPreviewResponse,
  ImportPreviewSummary,
  ImportValidationError,
  ImportRowStatus,
} from "./types";

/**
 * Generates a complete server-side preview of an inventory import spreadsheet.
 * Performs deep validation, category classification, unique SKU generation,
 * duplicate candidate detection, and Neon DB reconciliation.
 *
 * GUARANTEE: Performs ZERO database writes.
 */
export async function generateInventoryImportPreview(
  data: Buffer | string,
  filename: string,
  actingAdminEmail: string,
  options?: ParseSpreadsheetOptions
): Promise<ImportPreviewResponse> {
  // 1. Parse spreadsheet structure
  const { headers, rows: rawRows } = parseInventorySpreadsheet(data, filename, options);

  // 2. Build intra-file duplicate name index
  const duplicateIndex = buildDuplicateNameIndex(rawRows);

  // 3. First pass: classify categories and generate SKUs
  const usedSkusInFile = new Set<string>();
  const preValidated: Array<{
    raw: (typeof rawRows)[0];
    finalSku: string;
    skuGenerated: boolean;
    suggestedCategory: string;
    finalCategory: string;
    categoryConfidence: "explicit" | "suggested" | "unassigned";
    qtyResult: ReturnType<typeof parseQuantityAndUnit>;
    dupResult: ReturnType<typeof checkDuplicateCandidate>;
  }> = [];

  for (const raw of rawRows) {
    const classResult = classifyEquipmentCategory(raw.name, raw.category, raw.notes);
    const qtyResult = parseQuantityAndUnit(raw.totalQuantity);
    const dupResult = checkDuplicateCandidate(raw.name, raw.line, duplicateIndex);

    let finalSku = (raw.sku || "").trim().toUpperCase();
    let skuGenerated = false;

    if (!finalSku) {
      finalSku = generateCompliantSku(
        raw.name,
        classResult.category || "General",
        raw.line,
        usedSkusInFile
      );
      skuGenerated = true;
    } else {
      usedSkusInFile.add(finalSku);
    }

    preValidated.push({
      raw,
      finalSku,
      skuGenerated,
      suggestedCategory: classResult.confidence === "suggested" ? classResult.category : "",
      finalCategory: classResult.category,
      categoryConfidence: classResult.confidence,
      qtyResult,
      dupResult,
    });
  }

  // 4. Batch query Neon DB for existing SKUs and item names
  const candidateSkus = preValidated.map((p) => p.finalSku);
  const candidateNames = preValidated.map((p) => p.raw.name);
  const { skuMap: dbSkuMap, nameMap: dbNameMap } = await checkExistingDbInventory(
    candidateSkus,
    candidateNames
  );

  // 5. Build validated rows and aggregate summary
  const rows: ValidatedImportRow[] = [];
  const globalErrors: ImportValidationError[] = [];
  const globalWarnings: ImportValidationError[] = [];

  let validNewCount = 0;
  let alreadyExistsCount = 0;
  let duplicateCandidateCount = 0;
  let uncertainCategoryCount = 0;
  let nonStandardUnitCount = 0;
  let invalidCount = 0;
  let totalInitialUnitsToProvision = 0;

  for (const item of preValidated) {
    const { raw, finalSku, skuGenerated, suggestedCategory, finalCategory, categoryConfidence, qtyResult, dupResult } =
      item;

    const rowErrors: ImportValidationError[] = [];
    const rowWarnings: ImportValidationError[] = [];

    // Equipment Name validation
    if (!raw.name || raw.name.trim() === "") {
      rowErrors.push({
        line: raw.line,
        field: "name",
        message: "Equipment name is missing or blank.",
        severity: "error",
      });
    }

    // SKU regex validation
    if (!skuRegex.test(finalSku)) {
      rowErrors.push({
        line: raw.line,
        field: "sku",
        message: `SKU '${finalSku}' does not conform to required format (2-64 uppercase letters, numbers, hyphens, underscores).`,
        severity: "error",
        rawValue: finalSku,
      });
    }

    // Quantity validation
    if (qtyResult.error) {
      rowErrors.push({
        line: raw.line,
        field: "totalQuantity",
        message: qtyResult.error,
        severity: "error",
        rawValue: qtyResult.rawString,
      });
    } else if (qtyResult.warning) {
      rowWarnings.push({
        line: raw.line,
        field: "totalQuantity",
        message: qtyResult.warning,
        severity: "warning",
        rawValue: qtyResult.rawString,
      });
      nonStandardUnitCount++;
    }

    // Category validation
    if (!finalCategory || finalCategory.trim() === "") {
      uncertainCategoryCount++;
      rowErrors.push({
        line: raw.line,
        field: "category",
        message:
          "Category is required by database but was not specified in row and could not be deterministically inferred. Please review and assign a category.",
        severity: "error",
      });
    }

    // Duplicate name candidate warning
    if (dupResult.isDuplicateCandidate && dupResult.warningMessage) {
      rowWarnings.push({
        line: raw.line,
        field: "name",
        message: dupResult.warningMessage,
        severity: "warning",
      });
      duplicateCandidateCount++;
    }

    // Check if SKU already exists in Neon DB
    const existingDbItem = dbSkuMap.get(finalSku);
    let status: ImportRowStatus = "valid_new";

    if (existingDbItem) {
      status = "already_exists";
      alreadyExistsCount++;
      rowWarnings.push({
        line: raw.line,
        field: "sku",
        message: `An inventory item with SKU '${finalSku}' ('${existingDbItem.name}') already exists in the database. Row will be skipped to protect existing stock balances.`,
        severity: "warning",
        rawValue: finalSku,
      });
    } else if (rowErrors.length > 0) {
      status = !finalCategory ? "needs_review" : "invalid";
      invalidCount++;
    } else {
      status = "valid_new";
      validNewCount++;
      totalInitialUnitsToProvision += qtyResult.quantity;
    }

    // Build internal notes preserving original notes and unit information
    const internalNoteParts: string[] = [];
    if (raw.notes && raw.notes.trim()) {
      internalNoteParts.push(raw.notes.trim());
    }
    if (qtyResult.hasNonStandardUnit) {
      internalNoteParts.push(`[Source Unit: ${qtyResult.quantity} ${qtyResult.unit}]`);
    }

    const validatedRow: ValidatedImportRow = {
      line: raw.line,
      name: raw.name,
      originalSku: raw.sku || "",
      generatedSku: skuGenerated ? finalSku : "",
      finalSku,
      skuGenerated,
      originalCategory: raw.category || "",
      suggestedCategory,
      finalCategory,
      categoryConfidence,
      originalQuantityStr: qtyResult.rawString,
      parsedQuantity: qtyResult.quantity,
      parsedUnit: qtyResult.unit,
      hasNonStandardUnit: qtyResult.hasNonStandardUnit,
      notes: raw.notes || "",
      internalNotes: internalNoteParts.join(" | "),
      status,
      errors: rowErrors,
      warnings: rowWarnings,
      isDuplicateCandidate: dupResult.isDuplicateCandidate,
      duplicateCandidateLines: dupResult.duplicateCandidateLines,
      existingDbItem,
    };

    rows.push(validatedRow);
    globalErrors.push(...rowErrors);
    globalWarnings.push(...rowWarnings);
  }

  const summary: ImportPreviewSummary = {
    totalRows: rows.length,
    validNewCount,
    alreadyExistsCount,
    duplicateCandidateCount,
    uncertainCategoryCount,
    nonStandardUnitCount,
    invalidCount,
    totalInitialUnitsToProvision,
  };

  return {
    summary,
    rows,
    headersDiscovered: headers,
    errors: globalErrors,
    warnings: globalWarnings,
    actingAdminEmail,
    timestamp: new Date().toISOString(),
  };
}
