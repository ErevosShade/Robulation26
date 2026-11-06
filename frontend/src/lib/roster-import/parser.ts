import Papa from "papaparse";
import {
  MAX_CSV_FILE_SIZE_BYTES,
  MAX_CSV_ROW_COUNT,
  type RawCsvRecord,
  type ValidatedRosterRow,
  type RosterValidationError,
} from "./types";
import { normalizeName } from "./normalizers";
import {
  validateEmailField,
  validateRoleField,
  validateActiveField,
  validateHeaders,
} from "./validators";
import { FileDuplicateDetector } from "./duplicate-detector";

export interface ParseCsvOptions {
  maxSizeBytes?: number;
  maxRowCount?: number;
}

export interface ParseCsvResult {
  success: boolean;
  rows: ValidatedRosterRow[];
  globalErrors: RosterValidationError[];
  headers: string[];
}

/**
 * Parses raw CSV content adhering to RFC 4180 (handling quoted fields, commas, escaped quotes).
 * Performs initial row-level structural and syntax validation.
 */
export function parseAndValidateCsv(
  csvContent: string,
  options: ParseCsvOptions = {}
): ParseCsvResult {
  const maxSizeBytes = options.maxSizeBytes ?? MAX_CSV_FILE_SIZE_BYTES;
  const maxRowCount = options.maxRowCount ?? MAX_CSV_ROW_COUNT;
  const globalErrors: RosterValidationError[] = [];

  // 1. Enforce size limit
  const contentBytes = new TextEncoder().encode(csvContent).length;
  if (contentBytes > maxSizeBytes) {
    const sizeMb = (contentBytes / (1024 * 1024)).toFixed(2);
    const limitMb = (maxSizeBytes / (1024 * 1024)).toFixed(2);
    return {
      success: false,
      rows: [],
      globalErrors: [
        {
          line: 0,
          field: "general",
          message: `CSV file size (${sizeMb} MB) exceeds maximum permitted limit (${limitMb} MB).`,
        },
      ],
      headers: [],
    };
  }

  // 2. Reject empty or whitespace-only files
  if (!csvContent || !csvContent.trim()) {
    return {
      success: false,
      rows: [],
      globalErrors: [
        {
          line: 0,
          field: "general",
          message: "CSV file is empty. Please upload a file containing member records.",
        },
      ],
      headers: [],
    };
  }

  // 3. PapaParse parsing
  const parsed = Papa.parse<RawCsvRecord>(csvContent, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim().toLowerCase(),
  });

  // Check PapaParse syntax errors
  if (parsed.errors && parsed.errors.length > 0) {
    for (const parseErr of parsed.errors) {
      if (parseErr.code === "UndetectableDelimiter") {
        continue;
      }
      globalErrors.push({
        line: parseErr.row !== undefined ? parseErr.row + 2 : 0,
        field: "general",
        message: `CSV parsing error: ${parseErr.message} (${parseErr.code})`,
      });
    }
  }

  const headers = parsed.meta.fields || [];

  // 4. Validate headers
  const headerValidation = validateHeaders(headers);
  if (!headerValidation.isValid) {
    return {
      success: false,
      rows: [],
      globalErrors: [
        ...globalErrors,
        {
          line: 1,
          field: "general",
          message: headerValidation.error || "Invalid CSV headers.",
        },
      ],
      headers,
    };
  }

  // 5. Enforce row count limit
  const dataRows = parsed.data || [];
  if (dataRows.length > maxRowCount) {
    return {
      success: false,
      rows: [],
      globalErrors: [
        ...globalErrors,
        {
          line: 0,
          field: "general",
          message: `CSV file contains ${dataRows.length} rows, which exceeds the maximum limit of ${maxRowCount} rows.`,
        },
      ],
      headers,
    };
  }

  if (dataRows.length === 0) {
    return {
      success: false,
      rows: [],
      globalErrors: [
        ...globalErrors,
        {
          line: 1,
          field: "general",
          message: "CSV file contains a header row but no data rows.",
        },
      ],
      headers,
    };
  }

  // 6. Process and validate each data row
  const duplicateDetector = new FileDuplicateDetector();
  const validatedRows: ValidatedRosterRow[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const rawRow = dataRows[i];
    const lineNumber = i + 2; // Line 1 is header
    const rowErrors: RosterValidationError[] = [];

    // Clean & normalize name
    const normalizedName = normalizeName(rawRow.name);

    // Validate email
    const emailResult = validateEmailField(rawRow.email);
    if (!emailResult.isValid) {
      rowErrors.push({
        line: lineNumber,
        field: "email",
        message: emailResult.error!,
        rawValue: rawRow.email,
      });
    }

    // Validate role
    const roleResult = validateRoleField(rawRow.role);
    if (!roleResult.isValid) {
      rowErrors.push({
        line: lineNumber,
        field: "role",
        message: roleResult.error!,
        rawValue: rawRow.role,
      });
    }

    // Validate active
    const activeResult = validateActiveField(rawRow.active);
    if (!activeResult.isValid) {
      rowErrors.push({
        line: lineNumber,
        field: "active",
        message: activeResult.error!,
        rawValue: rawRow.active,
      });
    }

    const email = emailResult.value || (rawRow.email || "").trim().toLowerCase();
    const role = roleResult.value || "member";
    const active = activeResult.value ?? true;

    // Check intra-file duplicate
    let isFileDuplicate = false;
    if (emailResult.isValid && email) {
      const dupCheck = duplicateDetector.registerEmail(email, lineNumber);
      if (dupCheck.isDuplicate) {
        isFileDuplicate = true;
        rowErrors.push({
          line: lineNumber,
          field: "email",
          message: `Duplicate email "${email}" within CSV file (first appeared on line ${dupCheck.firstLine}).`,
          rawValue: rawRow.email,
        });
      }
    }

    let status: ValidatedRosterRow["status"] = "valid_new";
    if (rowErrors.length > 0) {
      status = isFileDuplicate ? "duplicate_in_file" : "invalid";
    }

    validatedRows.push({
      line: lineNumber,
      name: normalizedName,
      email,
      role,
      active,
      status,
      errors: rowErrors,
    });
  }

  return {
    success: globalErrors.length === 0,
    rows: validatedRows,
    globalErrors,
    headers,
  };
}
