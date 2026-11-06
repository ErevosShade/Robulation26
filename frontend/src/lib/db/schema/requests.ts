import {
  pgTable,
  text,
  timestamp,
  integer,
  index,
  uniqueIndex,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { inventoryItems } from "./inventory";

/**
 * Authoritative borrowing requests table.
 * Tracks full borrowing lifecycle:
 * pending -> approved (or rejected) -> collected -> partially_returned -> returned
 */
export const inventoryRequests = pgTable(
  "inventory_requests",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull(),
    userEmail: text("user_email").notNull(),
    userName: text("user_name").notNull(),
    project: text("project").notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    status: text("status").default("pending").notNull(),
    adminNotes: text("admin_notes"),
    reviewedBy: text("reviewed_by"),
    reviewedAt: timestamp("reviewed_at"),
    collectedBy: text("collected_by"),
    collectedAt: timestamp("collected_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("inventory_requests_user_id_idx").on(table.userId),
    index("inventory_requests_status_idx").on(table.status),
    index("inventory_requests_created_at_idx").on(table.createdAt),
    check(
      "inventory_requests_dates_valid_check",
      sql`${table.endDate} >= ${table.startDate}`
    ),
    check(
      "inventory_requests_status_check",
      sql`${table.status} IN ('pending', 'approved', 'rejected', 'cancelled', 'collected', 'partially_returned', 'returned')`
    ),
  ]
);

/**
 * Individual items requested within a borrowing request.
 * Tracks requested quantity as well as returned balances (good vs damaged).
 */
export const inventoryRequestItems = pgTable(
  "inventory_request_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    requestId: text("request_id")
      .notNull()
      .references(() => inventoryRequests.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => inventoryItems.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    returnedGoodQuantity: integer("returned_good_quantity").default(0).notNull(),
    returnedDamagedQuantity: integer("returned_damaged_quantity").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("inventory_request_items_request_id_idx").on(table.requestId),
    index("inventory_request_items_item_id_idx").on(table.itemId),
    uniqueIndex("inventory_request_items_unique_item_idx").on(
      table.requestId,
      table.itemId
    ),
    check("inventory_request_items_positive_quantity_check", sql`${table.quantity} > 0`),
    check(
      "inventory_request_items_returned_quantity_check",
      sql`${table.quantity} >= (${table.returnedGoodQuantity} + ${table.returnedDamagedQuantity})`
    ),
    check(
      "inventory_request_items_non_negative_returns_check",
      sql`${table.returnedGoodQuantity} >= 0 AND ${table.returnedDamagedQuantity} >= 0`
    ),
  ]
);

/**
 * Hardware return events recorded by members or admins.
 */
export const inventoryReturns = pgTable(
  "inventory_returns",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    requestId: text("request_id")
      .notNull()
      .references(() => inventoryRequests.id, { onDelete: "cascade" }),
    returnedBy: text("returned_by").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("inventory_returns_request_id_idx").on(table.requestId),
    index("inventory_returns_created_at_idx").on(table.createdAt),
  ]
);

/**
 * Individual items and conditions within a hardware return event.
 */
export const inventoryReturnItems = pgTable(
  "inventory_return_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    returnId: text("return_id")
      .notNull()
      .references(() => inventoryReturns.id, { onDelete: "cascade" }),
    itemId: text("item_id")
      .notNull()
      .references(() => inventoryItems.id, { onDelete: "restrict" }),
    quantity: integer("quantity").notNull(),
    condition: text("condition").notNull(), // 'good' | 'damaged'
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("inventory_return_items_return_id_idx").on(table.returnId),
    index("inventory_return_items_item_id_idx").on(table.itemId),
    check("inventory_return_items_positive_qty_check", sql`${table.quantity} > 0`),
    check(
      "inventory_return_items_condition_check",
      sql`${table.condition} IN ('good', 'damaged')`
    ),
  ]
);

export type InventoryRequest = typeof inventoryRequests.$inferSelect;
export type NewInventoryRequest = typeof inventoryRequests.$inferInsert;
export type InventoryRequestItem = typeof inventoryRequestItems.$inferSelect;
export type NewInventoryRequestItem = typeof inventoryRequestItems.$inferInsert;
export type InventoryReturn = typeof inventoryReturns.$inferSelect;
export type NewInventoryReturn = typeof inventoryReturns.$inferInsert;
export type InventoryReturnItem = typeof inventoryReturnItems.$inferSelect;
export type NewInventoryReturnItem = typeof inventoryReturnItems.$inferInsert;
