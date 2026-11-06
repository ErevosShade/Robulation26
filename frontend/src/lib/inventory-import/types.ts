/**
 * Types and interfaces for Excel/CSV Bulk Inventory Import.
 */

export const MAX_IMPORT_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_IMPORT_ROW_COUNT = 5000;

export type CategoryConfidence = "explicit" | "suggested" | "unassigned";

export type ImportRowStatus =
  | "valid_new"
  | "already_exists"
  | "needs_review"
  | "invalid";

export interface RawInventoryRow {
  line: number;
  name: string;
  sku?: string;
  category?: string;
  totalQuantity?: string;
  notes?: string;
  id?: string;
  rawFields: Record<string, string>;
}

export interface ImportValidationError {
  line: number;
  field?: "name" | "sku" | "category" | "totalQuantity" | "general";
  message: string;
  severity: "error" | "warning";
  rawValue?: string;
}

export interface ValidatedImportRow {
  line: number;
  name: string; // Original equipment name - never altered or shortened
  originalSku: string;
  generatedSku: string;
  finalSku: string;
  skuGenerated: boolean;
  
  originalCategory: string;
  suggestedCategory: string;
  finalCategory: string;
  categoryConfidence: CategoryConfidence;

  originalQuantityStr: string;
  parsedQuantity: number;
  parsedUnit: string;
  hasNonStandardUnit: boolean;

  notes: string;
  internalNotes: string;

  status: ImportRowStatus;
  errors: ImportValidationError[];
  warnings: ImportValidationError[];

  isDuplicateCandidate: boolean;
  duplicateCandidateLines: number[];

  existingDbItem?: {
    id: string;
    name: string;
    sku: string;
    category: string;
    totalQuantity: number;
  };
}

export interface ImportPreviewSummary {
  totalRows: number;
  validNewCount: number;
  alreadyExistsCount: number;
  duplicateCandidateCount: number;
  uncertainCategoryCount: number;
  nonStandardUnitCount: number;
  invalidCount: number;
  totalInitialUnitsToProvision: number;
}

export interface ImportPreviewResponse {
  summary: ImportPreviewSummary;
  rows: ValidatedImportRow[];
  headersDiscovered: string[];
  errors: ImportValidationError[];
  warnings: ImportValidationError[];
  actingAdminEmail: string;
  timestamp: string;
}

export interface ImportCommitRowPayload {
  line: number;
  name: string;
  sku: string;
  category: string;
  totalQuantity: number;
  unit: string;
  notes?: string;
  internalNotes?: string;
  locationRoom?: string;
  locationCabinet?: string;
  locationShelf?: string;
  locationBin?: string;
  consumable?: boolean;
}

export interface ImportCommitPayload {
  rows: ImportCommitRowPayload[];
  batchId?: string;
  filename?: string;
}

export interface ImportCommitResultSummary {
  totalProcessed: number;
  insertedCount: number;
  skippedCount: number;
  errorCount: number;
  totalUnitsProvisioned: number;
}

export interface ImportCommitResponse {
  success: boolean;
  batchId: string;
  summary: ImportCommitResultSummary;
  insertedSkus: string[];
  skippedSkus: string[];
  errors: ImportValidationError[];
  message: string;
}
