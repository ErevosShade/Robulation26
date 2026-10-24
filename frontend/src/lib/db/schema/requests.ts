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
      sql`${table.status} IN ('pending', 'approved', 'rejected', 'cancelled')`
    ),
  ]
);

/**
 * Individual items requested within a borrowing request.
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
  ]
);

export type InventoryRequest = typeof inventoryRequests.$inferSelect;
export type NewInventoryRequest = typeof inventoryRequests.$inferInsert;
export type InventoryRequestItem = typeof inventoryRequestItems.$inferSelect;
export type NewInventoryRequestItem = typeof inventoryRequestItems.$inferInsert;
