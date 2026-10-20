/**
 * Standardized inventory domain errors.
 */

export type InventoryErrorCode =
  | "ITEM_NOT_FOUND"
  | "DUPLICATE_SKU"
  | "DUPLICATE_SLUG"
  | "INSUFFICIENT_STOCK"
  | "INVALID_STOCK_OPERATION"
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
