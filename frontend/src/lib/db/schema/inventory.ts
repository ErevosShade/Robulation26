import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

/**
 * Authoritative hardware lab inventory items catalog.
 */
export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    sku: text("sku").notNull().unique(),
    category: text("category").notNull(),
    description: text("description"),
    tags: jsonb("tags").$type<string[]>().default([]).notNull(),
    locationRoom: text("location_room"),
    locationCabinet: text("location_cabinet"),
    locationShelf: text("location_shelf"),
    locationBin: text("location_bin"),
    unitCost: numeric("unit_cost", { precision: 12, scale: 2 }),
    currency: text("currency").default("INR").notNull(),
    totalQuantity: integer("total_quantity").default(0).notNull(),
    reservedQuantity: integer("reserved_quantity").default(0).notNull(),
    checkedOutQuantity: integer("checked_out_quantity").default(0).notNull(),
    damagedQuantity: integer("damaged_quantity").default(0).notNull(),
    minimumStock: integer("minimum_stock").default(0).notNull(),
    consumable: boolean("consumable").default(false).notNull(),
    active: boolean("active").default(true).notNull(),
    archived: boolean("archived").default(false).notNull(),
    archivedAt: timestamp("archived_at"),
    internalNotes: text("internal_notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("inventory_items_sku_idx").on(table.sku),
    uniqueIndex("inventory_items_slug_idx").on(table.slug),
    index("inventory_items_category_idx").on(table.category),
    index("inventory_items_name_idx").on(table.name),
    index("inventory_items_active_archived_idx").on(table.active, table.archived),
  ]
);

/**
 * Append-only immutable stock mutation ledger.
 */
export const inventoryLedger = pgTable(
  "inventory_stock_ledger",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    itemId: text("item_id")
      .notNull()
      .references(() => inventoryItems.id, { onDelete: "restrict" }),
    transactionType: text("transaction_type").notNull(),
    quantityDelta: integer("quantity_delta").notNull(),
    totalQuantityAfter: integer("total_quantity_after").notNull(),
    availableQuantityAfter: integer("available_quantity_after").notNull(),
    reservedQuantityAfter: integer("reserved_quantity_after").notNull(),
    checkedOutQuantityAfter: integer("checked_out_quantity_after").notNull(),
    damagedQuantityAfter: integer("damaged_quantity_after").notNull(),
    performedBy: text("performed_by").notNull(),
    reason: text("reason").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("inventory_ledger_item_id_idx").on(table.itemId),
    index("inventory_ledger_created_at_idx").on(table.createdAt),
    index("inventory_ledger_type_idx").on(table.transactionType),
  ]
);

export type InventoryItem = typeof inventoryItems.$inferSelect;
export type NewInventoryItem = typeof inventoryItems.$inferInsert;
export type InventoryLedgerRow = typeof inventoryLedger.$inferSelect;
export type NewInventoryLedgerRow = typeof inventoryLedger.$inferInsert;
