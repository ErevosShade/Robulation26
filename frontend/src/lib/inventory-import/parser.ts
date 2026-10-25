import * as XLSX from "xlsx";
import Papa from "papaparse";
import {
  mapDiscoveredHeaders,
  preserveEquipmentName,
} from "./normalizers";
import {
  MAX_IMPORT_FILE_SIZE_BYTES,
  MAX_IMPORT_ROW_COUNT,
  type RawInventoryRow,
} from "./types";

export interface ParseSpreadsheetOptions {
  maxSizeBytes?: number;
  maxRowCount?: number;
}

export interface ParseSpreadsheetResult {
  headers: string[];
  rows: RawInventoryRow[];
  totalRowsFound: number;
}

/**
 * Parses an Excel (.xlsx / .xls) buffer or CSV string into raw structured inventory rows.
 * Disables formula evaluation to prevent macro or injection vulnerabilities.
 */
export function parseInventorySpreadsheet(
  data: Buffer | string,
  filename: string,
  options?: ParseSpreadsheetOptions
): ParseSpreadsheetResult {
  const maxBytes = options?.maxSizeBytes ?? MAX_IMPORT_FILE_SIZE_BYTES;
  const maxRows = options?.maxRowCount ?? MAX_IMPORT_ROW_COUNT;

  if (!data || (typeof data === "string" && data.trim() === "") || (Buffer.isBuffer(data) && data.length === 0)) {
    throw new Error("Uploaded spreadsheet file is empty.");
  }

  const byteLength = Buffer.isBuffer(data) ? data.length : Buffer.byteLength(data, "utf8");
  if (byteLength > maxBytes) {
    throw new Error(
      `File size (${(byteLength / 1024 / 1024).toFixed(2)} MB) exceeds maximum allowed limit of ${(
        maxBytes /
        1024 /
        1024
      ).toFixed(2)} MB.`
    );
  }

  const lowerName = filename.toLowerCase();
  let rawGrid: unknown[][];

  if (lowerName.endsWith(".csv") && typeof data === "string") {
    // CSV string parsing via PapaParse
    const parsed = Papa.parse<string[]>(data, {
      skipEmptyLines: "greedy",
    });

    if (parsed.errors.length > 0) {
      const firstErr = parsed.errors[0];
      throw new Error(`CSV Parsing error at row ${firstErr.row}: ${firstErr.message}`);
    }

    rawGrid = parsed.data;
  } else {
    // Excel or binary CSV parsing via SheetJS (XLSX)
    const workbook = XLSX.read(data, {
      type: Buffer.isBuffer(data) ? "buffer" : "string",
      cellFormula: false, // Security: do not evaluate formulas
      cellHTML: false, // Security: do not evaluate embedded HTML
    });

    if (workbook.SheetNames.length === 0) {
      throw new Error("Spreadsheet contains no accessible worksheets.");
    }

    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    rawGrid = XLSX.utils.sheet_to_json<unknown[]>(firstSheet, {
      header: 1,
      defval: "",
      blankrows: false,
    });
  }

  if (rawGrid.length === 0) {
    throw new Error("Spreadsheet contains no rows.");
  }

  // Header row
  const headerRow = rawGrid[0].map((cell) => String(cell || "").trim());
  const mapping = mapDiscoveredHeaders(headerRow);

  if (mapping.nameCol === -1) {
    throw new Error(
      "Spreadsheet is missing required 'name' or 'equipment name' column header."
    );
  }

  const dataRows = rawGrid.slice(1);
  if (dataRows.length > maxRows) {
    throw new Error(
      `Spreadsheet row count (${dataRows.length}) exceeds maximum allowed limit of ${maxRows} rows.`
    );
  }

  const rows: RawInventoryRow[] = [];

  dataRows.forEach((row, idx) => {
    // Check if row is completely empty across all discovered columns
    const hasAnyContent = row.some((cell) => cell !== undefined && cell !== null && String(cell).trim() !== "");
    if (!hasAnyContent) {
      return; // Skip completely blank trailing rows safely
    }

    const line = idx + 2; // Row index 1-based, accounting for header row at line 1
    const name = preserveEquipmentName(row[mapping.nameCol]);
    const sku = mapping.skuCol !== -1 ? String(row[mapping.skuCol] || "").trim() : undefined;
    const category = mapping.categoryCol !== -1 ? String(row[mapping.categoryCol] || "").trim() : undefined;
    const totalQuantity =
      mapping.quantityCol !== -1 ? String(row[mapping.quantityCol] || "").trim() : undefined;
    const notes = mapping.notesCol !== -1 ? String(row[mapping.notesCol] || "").trim() : undefined;
    const id = mapping.idCol !== -1 ? String(row[mapping.idCol] || "").trim() : undefined;

    const rawFields: Record<string, string> = {};
    headerRow.forEach((h, colIdx) => {
      if (h) {
        rawFields[h] = row[colIdx] !== undefined ? String(row[colIdx]).trim() : "";
      }
    });

    rows.push({
      line,
      name,
      sku,
      category,
      totalQuantity,
      notes,
      id,
      rawFields,
    });
  });

  return {
    headers: mapping.discovered,
    rows,
    totalRowsFound: rows.length,
  };
}
