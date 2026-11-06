import type {
  InventoryItemBase,
  InventoryItemDto,
  InventoryItemPublicDto,
  ItemStatus,
} from "./types";
import { InventoryError } from "./errors";

/**
 * Pure functions for stock accounting and invariant enforcement.
 */

export interface StockQuantities {
  totalQuantity: number;
  reservedQuantity: number;
  checkedOutQuantity: number;
  damagedQuantity: number;
  minimumStock?: number;
}

/**
 * Computes usable stock available for immediate borrowing.
 * Invariant: available = total - (reserved + checked_out + damaged)
 */
export function computeAvailableQuantity(quantities: StockQuantities): number {
  const { totalQuantity, reservedQuantity, checkedOutQuantity, damagedQuantity } =
    quantities;
  return totalQuantity - (reservedQuantity + checkedOutQuantity + damagedQuantity);
}

export const calculateAvailableQuantity = computeAvailableQuantity;


/**
 * Derives authoritative item status from active flag, archival status,
 * available quantity, and minimum stock threshold.
 */
export function deriveItemStatus(
  item: { active: boolean; archived: boolean; minimumStock: number },
  availableQuantity: number
): ItemStatus {
  if (item.archived || !item.active) {
    return "archived";
  }
  if (availableQuantity <= 0) {
    return "out_of_stock";
  }
  if (availableQuantity <= item.minimumStock) {
    return "low_stock";
  }
  return "in_stock";
}

/**
 * Strictly verifies all mathematical stock invariants.
 * 1. Non-negative quantities.
 * 2. availableQuantity >= 0.
 * 3. totalQuantity >= reservedQuantity + checkedOutQuantity + damagedQuantity.
 */
export function validateStockInvariants(
  quantities: StockQuantities
): { isValid: boolean; error?: string } {
  const {
    totalQuantity,
    reservedQuantity,
    checkedOutQuantity,
    damagedQuantity,
    minimumStock = 0,
  } = quantities;

  if (
    !Number.isInteger(totalQuantity) ||
    !Number.isInteger(reservedQuantity) ||
    !Number.isInteger(checkedOutQuantity) ||
    !Number.isInteger(damagedQuantity) ||
    !Number.isInteger(minimumStock)
  ) {
    return {
      isValid: false,
      error: "Stock quantities must be integers.",
    };
  }

  if (
    totalQuantity < 0 ||
    reservedQuantity < 0 ||
    checkedOutQuantity < 0 ||
    damagedQuantity < 0 ||
    minimumStock < 0
  ) {
    return {
      isValid: false,
      error: "Stock quantities cannot be negative.",
    };
  }

  const committedQuantity = reservedQuantity + checkedOutQuantity + damagedQuantity;
  if (totalQuantity < committedQuantity) {
    return {
      isValid: false,
      error: `Total holdings (${totalQuantity}) cannot be less than committed & damaged stock (${committedQuantity}).`,
    };
  }

  const available = computeAvailableQuantity(quantities);
  if (available < 0) {
    return {
      isValid: false,
      error: `Computed available quantity (${available}) cannot be negative.`,
    };
  }

  return { isValid: true };
}

/**
 * Asserts stock invariants and throws InventoryError if violated.
 */
export function assertStockInvariants(quantities: StockQuantities): void {
  const validation = validateStockInvariants(quantities);
  if (!validation.isValid) {
    throw new InventoryError(
      "INVALID_STOCK_OPERATION",
      validation.error || "Stock invariant violation.",
      400
    );
  }
}

/**
 * Enriches a raw database item row with computed availableQuantity and status.
 * Strips internalNotes if the caller is not an admin.
 */
export function enrichItemWithComputedStock(
  rawItem: InventoryItemBase & { internalNotes?: string | null },
  isAdmin: boolean
): InventoryItemDto | InventoryItemPublicDto {
  const availableQuantity = computeAvailableQuantity(rawItem);
  const status = deriveItemStatus(rawItem, availableQuantity);

  if (isAdmin) {
    return {
      ...rawItem,
      availableQuantity,
      status,
      internalNotes: rawItem.internalNotes ?? null,
    };
  }

  // Sanitize internalNotes for non-admin callers
  const { internalNotes: _omittedNotes, ...publicFields } = rawItem;
  return {
    ...publicFields,
    availableQuantity,
    status,
  };
}

/**
 * Generates a clean URL slug from an item name.
 */
export function generateSlugFromName(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return base || "item";
}
