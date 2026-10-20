/**
 * TypeScript definitions for Robolution inventory domain.
 */

export type ItemStatus = "in_stock" | "low_stock" | "out_of_stock" | "archived";

export type StockLedgerTransactionType =
  | "initial_stock"
  | "adjustment"
  | "reservation"
  | "checkout"
  | "return"
  | "damage"
  | "write_off"
  | "archival";

export interface ItemLocation {
  room?: string | null;
  cabinet?: string | null;
  shelf?: string | null;
  bin?: string | null;
}

export interface InventoryItemBase {
  id: string;
  name: string;
  slug: string;
  sku: string;
  category: string;
  description?: string | null;
  tags?: string[] | null;
  locationRoom?: string | null;
  locationCabinet?: string | null;
  locationShelf?: string | null;
  locationBin?: string | null;
  unitCost?: string | null;
  currency: string;
  totalQuantity: number;
  reservedQuantity: number;
  checkedOutQuantity: number;
  damagedQuantity: number;
  minimumStock: number;
  consumable: boolean;
  active: boolean;
  archived: boolean;
  archivedAt?: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface InventoryItemDto extends InventoryItemBase {
  availableQuantity: number;
  status: ItemStatus;
  internalNotes?: string | null;
}

export interface InventoryItemPublicDto extends InventoryItemBase {
  availableQuantity: number;
  status: ItemStatus;
  // internalNotes is strictly omitted for non-admin callers
}

export interface CreateInventoryItemInput {
  name: string;
  sku: string;
  category: string;
  description?: string;
  slug?: string;
  tags?: string[];
  locationRoom?: string;
  locationCabinet?: string;
  locationShelf?: string;
  locationBin?: string;
  unitCost?: string;
  currency?: string;
  totalQuantity?: number;
  minimumStock?: number;
  consumable?: boolean;
  internalNotes?: string;
}

export interface UpdateInventoryItemInput {
  name?: string;
  category?: string;
  description?: string;
  tags?: string[];
  locationRoom?: string;
  locationCabinet?: string;
  locationShelf?: string;
  locationBin?: string;
  unitCost?: string;
  currency?: string;
  totalQuantity?: number;
  minimumStock?: number;
  consumable?: boolean;
  internalNotes?: string;
}

export interface InventoryCatalogQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: ItemStatus;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMetadata;
}

export interface StockLedgerEntry {
  id: string;
  itemId: string;
  transactionType: StockLedgerTransactionType;
  quantityDelta: number;
  totalQuantityAfter: number;
  availableQuantityAfter: number;
  reservedQuantityAfter: number;
  checkedOutQuantityAfter: number;
  damagedQuantityAfter: number;
  performedBy: string;
  reason: string;
  metadata?: Record<string, unknown> | null;
  createdAt: Date | string;
}
