/**
 * Standardized inventory domain errors.
 */

export type InventoryErrorCode =
  | "ITEM_NOT_FOUND"
  | "ITEM_ARCHIVED"
  | "DUPLICATE_SKU"
  | "DUPLICATE_SLUG"
  | "DUPLICATE_REQUEST_ITEM"
  | "INSUFFICIENT_STOCK"
  | "INVALID_STOCK_OPERATION"
  | "INVALID_DATE_RANGE"
  | "REQUEST_NOT_FOUND"
  | "FORBIDDEN_REQUEST_ACCESS"
  | "ACTIVE_COMMITMENTS_EXIST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "DATABASE_ERROR";

export class InventoryError extends Error {
  readonly code: InventoryErrorCode;
  readonly statusCode: number;
  readonly details?: Record<string, unknown> | unknown[];

  constructor(
    code: InventoryErrorCode,
    message: string,
    statusCode: number = 400,
    details?: Record<string, unknown> | unknown[]
  ) {
    super(message);
    this.name = "InventoryError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
