import {
  type RosterPreviewResponse,
  type RosterImportPreviewSummary,
  type ValidatedRosterRow,
  type RosterValidationError,
} from "./types";
import { parseAndValidateCsv, type ParseCsvOptions } from "./parser";
import { checkExistingRosterEmails } from "./db-checker";

/**
 * Generates an end-to-end preview of a CSV roster import without mutating the database.
 * 1. Parses RFC-4180 format.
 * 2. Enforces structural limits.
 * 3. Validates syntax for emails, roles, booleans.
 * 4. Identifies duplicate rows within the CSV.
 * 5. Correlates valid candidate emails against existing records in member_roster.
 */
export async function generateRosterPreview(
  csvContent: string,
  actingAdminEmail: string,
  options?: ParseCsvOptions
): Promise<RosterPreviewResponse> {
  const parseResult = parseAndValidateCsv(csvContent, options);

  if (!parseResult.success) {
    const summary: RosterImportPreviewSummary = {
      totalRows: 0,
      validNewCount: 0,
      alreadyExistsCount: 0,
      duplicateInFileCount: 0,
      invalidCount: 0,
    };

    return {
      summary,
      rows: [],
      errors: parseResult.globalErrors,
      actingAdminEmail,
      timestamp: new Date().toISOString(),
    };
  }

  const { rows } = parseResult;

  // Extract emails that are structurally valid candidates
  const candidateEmails = rows
    .filter((r) => r.status === "valid_new" && r.email)
    .map((r) => r.email);

  // Check database for existing emails (read-only)
  const existingMap = await checkExistingRosterEmails(candidateEmails);

  const allErrors: RosterValidationError[] = [...parseResult.globalErrors];
  const processedRows: ValidatedRosterRow[] = [];

  let validNewCount = 0;
  let alreadyExistsCount = 0;
  let duplicateInFileCount = 0;
  let invalidCount = 0;

  for (const row of rows) {
    const rowCopy: ValidatedRosterRow = { ...row, errors: [...row.errors] };

    if (rowCopy.status === "invalid") {
      invalidCount++;
      allErrors.push(...rowCopy.errors);
    } else if (rowCopy.status === "duplicate_in_file") {
      duplicateInFileCount++;
      allErrors.push(...rowCopy.errors);
    } else if (existingMap.has(rowCopy.email)) {
      const existing = existingMap.get(rowCopy.email)!;
      rowCopy.status = "already_exists";
      rowCopy.existingRecord = {
        id: existing.id,
        role: existing.role,
        active: existing.active,
      };
      alreadyExistsCount++;
    } else {
      rowCopy.status = "valid_new";
      validNewCount++;
    }

    processedRows.push(rowCopy);
  }

  const summary: RosterImportPreviewSummary = {
    totalRows: processedRows.length,
    validNewCount,
    alreadyExistsCount,
    duplicateInFileCount,
    invalidCount,
  };

  return {
    summary,
    rows: processedRows,
    errors: allErrors,
    actingAdminEmail,
    timestamp: new Date().toISOString(),
  };
}
