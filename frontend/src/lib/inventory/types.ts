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
  description?: string | null;
  slug?: string;
  tags?: string[];
  locationRoom?: string | null;
  locationCabinet?: string | null;
  locationShelf?: string | null;
  locationBin?: string | null;
  unitCost?: string | null;
  currency?: string;
  totalQuantity?: number;
  minimumStock?: number;
  consumable?: boolean;
  internalNotes?: string | null;
}

export interface UpdateInventoryItemInput {
  name?: string;
  category?: string;
  description?: string | null;
  tags?: string[];
  locationRoom?: string | null;
  locationCabinet?: string | null;
  locationShelf?: string | null;
  locationBin?: string | null;
  unitCost?: string | null;
  currency?: string;
  totalQuantity?: number;
  minimumStock?: number;
  consumable?: boolean;
  internalNotes?: string | null;
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

export type BorrowRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "collected"
  | "partially_returned"
  | "returned";

export interface BorrowRequestItemInput {
  itemId: string;
  quantity: number;
}

export interface CreateBorrowRequestInput {
  project: string;
  startDate: string | Date;
  endDate: string | Date;
  items: BorrowRequestItemInput[];
}

export interface BorrowRequestItemDto {
  id: string;
  requestId: string;
  itemId: string;
  quantity: number;
  returnedGoodQuantity?: number;
  returnedDamagedQuantity?: number;
  outstandingQuantity?: number;
  name: string;
  sku: string;
  category?: string;
  locationRoom?: string | null;
  createdAt: Date | string;
}

export interface BorrowRequestDto {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  project: string;
  startDate: Date | string;
  endDate: Date | string;
  status: BorrowRequestStatus;
  adminNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: Date | string | null;
  collectedBy?: string | null;
  collectedAt?: Date | string | null;
  items: BorrowRequestItemDto[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BorrowRequestsQuery {
  page?: number;
  limit?: number;
  status?: BorrowRequestStatus | "all";
  userId?: string;
}

export interface ReviewBorrowRequestInput {
  adminNotes?: string | null;
}

export interface CollectBorrowRequestInput {
  notes?: string | null;
}

export type ReturnItemCondition = "good" | "damaged";

export interface ReturnItemInput {
  itemId: string;
  quantity: number;
  condition: ReturnItemCondition;
  notes?: string | null;
}

export interface ReturnBorrowRequestInput {
  notes?: string | null;
  items: ReturnItemInput[];
}

export interface BorrowRequestReturnItemDto {
  id: string;
  returnId: string;
  itemId: string;
  name: string;
  sku: string;
  quantity: number;
  condition: ReturnItemCondition;
  notes?: string | null;
  createdAt: Date | string;
}

export interface BorrowRequestReturnDto {
  id: string;
  requestId: string;
  returnedBy: string;
  notes?: string | null;
  items: BorrowRequestReturnItemDto[];
  createdAt: Date | string;
}


