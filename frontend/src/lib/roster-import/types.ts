import type { InventoryRole } from "@/lib/auth";

export const ALLOWED_ROSTER_ROLES: readonly InventoryRole[] = [
  "admin",
  "member",
] as const;

export const MAX_CSV_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
export const MAX_CSV_ROW_COUNT = 1000;

export interface RawCsvRecord {
  name?: string;
  email?: string;
  role?: string;
  active?: string;
  [key: string]: string | undefined;
}

export type RowValidationStatus =
  | "valid_new"
  | "already_exists"
  | "duplicate_in_file"
  | "invalid";

export interface RosterValidationError {
  line: number;
  field?: "name" | "email" | "role" | "active" | "general";
  message: string;
  rawValue?: string;
}

export interface ValidatedRosterRow {
  line: number;
  name: string;
  email: string;
  role: InventoryRole;
  active: boolean;
  status: RowValidationStatus;
  errors: RosterValidationError[];
  existingRecord?: {
    id: string;
    role: string;
    active: boolean;
  };
}

export interface RosterImportPreviewSummary {
  totalRows: number;
  validNewCount: number;
  alreadyExistsCount: number;
  duplicateInFileCount: number;
  invalidCount: number;
}

export interface RosterPreviewResponse {
  summary: RosterImportPreviewSummary;
  rows: ValidatedRosterRow[];
  errors: RosterValidationError[];
  actingAdminEmail: string;
  timestamp: string;
}

export interface RosterImportResponse {
  success: boolean;
  summary: {
    totalProcessed: number;
    insertedCount: number;
    alreadyExistsCount: number;
    duplicateInFileCount: number;
    invalidCount: number;
  };
  insertedEmails: string[];
  errors: RosterValidationError[];
  message: string;
}
