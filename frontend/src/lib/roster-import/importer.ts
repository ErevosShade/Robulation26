import { db } from "@/lib/db";
import { memberRoster } from "@/lib/db/schema/roster";
import {
  type RosterImportResponse,
  type RosterValidationError,
} from "./types";
import { generateRosterPreview } from "./preview";
import type { ParseCsvOptions } from "./parser";

/**
 * Performs a safe, add-only bulk insert of validated members into member_roster.
 * - Always re-validates the CSV content on the server.
 * - Inserts ONLY rows verified as valid_new.
 * - Uses onConflictDoNothing to guarantee idempotency and concurrency protection.
 * - NEVER overwrites existing records, roles, or active statuses.
 * - Specifically safeguards existing administrator accounts.
 */
export async function executeRosterImport(
  csvContent: string,
  actingAdminEmail: string,
  options?: ParseCsvOptions
): Promise<RosterImportResponse> {
  // 1. Fresh server-side preview & re-validation
  const preview = await generateRosterPreview(csvContent, actingAdminEmail, options);

  if (preview.rows.length === 0 && preview.errors.length > 0) {
    return {
      success: false,
      summary: {
        totalProcessed: 0,
        insertedCount: 0,
        alreadyExistsCount: 0,
        duplicateInFileCount: 0,
        invalidCount: preview.errors.length,
      },
      insertedEmails: [],
      errors: preview.errors,
      message: "CSV validation failed. No records were written to the database.",
    };
  }

  // 2. Filter strictly valid new rows
  const candidateRows = preview.rows.filter((r) => r.status === "valid_new");

  if (candidateRows.length === 0) {
    return {
      success: true,
      summary: {
        totalProcessed: preview.summary.totalRows,
        insertedCount: 0,
        alreadyExistsCount: preview.summary.alreadyExistsCount,
        duplicateInFileCount: preview.summary.duplicateInFileCount,
        invalidCount: preview.summary.invalidCount,
      },
      insertedEmails: [],
      errors: preview.errors,
      message:
        "No new members to import. All rows are either invalid, duplicates within the file, or already present in the database.",
    };
  }

  // 3. Prepare insert payload with parameterized values
  const recordsToInsert = candidateRows.map((r) => ({
    name: r.name ? r.name : null,
    email: r.email,
    role: r.role,
    active: r.active,
  }));

  try {
    // 4. Atomic parameterized insert with onConflictDoNothing
    const insertedRecords = await db
      .insert(memberRoster)
      .values(recordsToInsert)
      .onConflictDoNothing({ target: memberRoster.email })
      .returning({
        id: memberRoster.id,
        email: memberRoster.email,
      });

    const insertedCount = insertedRecords.length;
    const insertedEmails = insertedRecords.map((r) => r.email);

    // Any candidate that did not get returned was handled by conflict (e.g. concurrent insert)
    const conflictSkippedCount = candidateRows.length - insertedCount;
    const effectiveAlreadyExistsCount =
      preview.summary.alreadyExistsCount + conflictSkippedCount;

    return {
      success: true,
      summary: {
        totalProcessed: preview.summary.totalRows,
        insertedCount,
        alreadyExistsCount: effectiveAlreadyExistsCount,
        duplicateInFileCount: preview.summary.duplicateInFileCount,
        invalidCount: preview.summary.invalidCount,
      },
      insertedEmails,
      errors: preview.errors,
      message: `Successfully imported ${insertedCount} new member(s) into the roster.${
        effectiveAlreadyExistsCount > 0
          ? ` ${effectiveAlreadyExistsCount} existing member(s) were preserved unchanged.`
          : ""
      }`,
    };
  } catch (error) {
    console.error("[Roster Importer] Database insert operation failed:", error);
    const dbError: RosterValidationError = {
      line: 0,
      field: "general",
      message:
        error instanceof Error
          ? `Database insertion failed: ${error.message}`
          : "Database insertion encountered an unhandled exception.",
    };

    return {
      success: false,
      summary: {
        totalProcessed: preview.summary.totalRows,
        insertedCount: 0,
        alreadyExistsCount: preview.summary.alreadyExistsCount,
        duplicateInFileCount: preview.summary.duplicateInFileCount,
        invalidCount: preview.summary.invalidCount + 1,
      },
      insertedEmails: [],
      errors: [...preview.errors, dbError],
      message: "Database insertion failed. Zero records were inserted.",
    };
  }
}
