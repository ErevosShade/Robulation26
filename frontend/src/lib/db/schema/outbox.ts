import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
  index,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/**
 * Transactional outbox for durable inventory notification dispatch.
 * Events are written inside the business transaction and processed asynchronously.
 */
export const inventoryNotificationOutbox = pgTable(
  "inventory_notification_outbox",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    channel: text("channel").default("telegram").notNull(),
    eventType: text("event_type").notNull(),
    referenceId: text("reference_id").notNull(),
    payload: jsonb("payload").$type<Record<string, unknown>>().notNull(),
    status: text("status").default("pending").notNull(),
    attempts: integer("attempts").default(0).notNull(),
    maxAttempts: integer("max_attempts").default(5).notNull(),
    lastAttemptAt: timestamp("last_attempt_at"),
    deliveredAt: timestamp("delivered_at"),
    lastError: text("last_error"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("inventory_outbox_status_created_idx").on(table.status, table.createdAt),
    index("inventory_outbox_reference_id_idx").on(table.referenceId),
    check(
      "inventory_outbox_status_check",
      sql`${table.status} IN ('pending', 'delivered', 'failed')`
    ),
    check("inventory_outbox_attempts_check", sql`${table.attempts} >= 0`),
  ]
);

export type InventoryNotificationOutbox =
  typeof inventoryNotificationOutbox.$inferSelect;
export type NewInventoryNotificationOutbox =
  typeof inventoryNotificationOutbox.$inferInsert;
