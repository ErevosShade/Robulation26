import { pgTable, text, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const memberRoster = pgTable(
  "member_roster",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull().unique(),
    role: text("role").notNull().default("member"), // 'admin' | 'member'
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("member_roster_email_idx").on(table.email)]
);

export type MemberRoster = typeof memberRoster.$inferSelect;
export type NewMemberRoster = typeof memberRoster.$inferInsert;
