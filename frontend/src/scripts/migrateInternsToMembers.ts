if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

import { sql, eq } from "drizzle-orm";
import { db } from "../lib/db";
import { memberRoster } from "../lib/db/schema/roster";
import { user } from "../lib/db/schema/auth";

export interface MigrationSummary {
  rosterInternsUpdated: number;
  userInternsUpdated: number;
  adminsPreserved: number;
  remainingRosterInterns: number;
  remainingUserInterns: number;
}

export async function migrateInternsToMembers(): Promise<MigrationSummary> {
  console.log("=== Starting Migration: Intern Roles to Members ===");

  // 1. Inspect existing state
  const rosterInternBefore = await db.execute<{ count: string }>(
    sql`SELECT count(*)::text as count FROM member_roster WHERE role = 'intern'`
  );
  const userInternBefore = await db.execute<{ count: string }>(
    sql`SELECT count(*)::text as count FROM "user" WHERE role = 'intern'`
  );

  const initialRosterInterns = parseInt(rosterInternBefore.rows[0]?.count || "0", 10);
  const initialUserInterns = parseInt(userInternBefore.rows[0]?.count || "0", 10);

  console.log(
    `[Pre-check] Records with role 'intern': member_roster=${initialRosterInterns}, user=${initialUserInterns}`
  );

  // 2. Perform safe, parameterized migration
  const updatedRosterRows = await db.execute<{ id: string; email: string }>(
    sql`UPDATE member_roster SET role = 'member', updated_at = NOW() WHERE role = 'intern' RETURNING id, email`
  );

  const updatedUserRows = await db.execute<{ id: string; email: string }>(
    sql`UPDATE "user" SET role = 'member', updated_at = NOW() WHERE role = 'intern' RETURNING id, email`
  );

  // Ensure default column value on "user" table is 'member'
  try {
    await db.execute(sql`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'member'`);
  } catch (err) {
    console.warn(`[Warning] Could not alter default column value: ${(err as Error).message}`);
  }

  const rosterInternsUpdated = updatedRosterRows.rows.length;
  const userInternsUpdated = updatedUserRows.rows.length;

  console.log(
    `[Migrated] Updated rows: member_roster=${rosterInternsUpdated}, user=${userInternsUpdated}`
  );

  // 3. Verify post-migration state
  const rosterInternAfter = await db.execute<{ count: string }>(
    sql`SELECT count(*)::text as count FROM member_roster WHERE role = 'intern'`
  );
  const userInternAfter = await db.execute<{ count: string }>(
    sql`SELECT count(*)::text as count FROM "user" WHERE role = 'intern'`
  );

  const remainingRosterInterns = parseInt(rosterInternAfter.rows[0]?.count || "0", 10);
  const remainingUserInterns = parseInt(userInternAfter.rows[0]?.count || "0", 10);

  if (remainingRosterInterns > 0 || remainingUserInterns > 0) {
    throw new Error(
      `Migration verification failed: Still found interns (member_roster=${remainingRosterInterns}, user=${remainingUserInterns})`
    );
  }

  // 4. Verify admin accounts are preserved and none were demoted
  const adminRoster = await db.execute<{ count: string }>(
    sql`SELECT count(*)::text as count FROM member_roster WHERE role = 'admin'`
  );
  const adminsPreserved = parseInt(adminRoster.rows[0]?.count || "0", 10);

  const [activeAdmin] = await db
    .select()
    .from(memberRoster)
    .where(eq(memberRoster.email, "hamzabitmesra786@gmail.com"))
    .limit(1);

  if (!activeAdmin || activeAdmin.role !== "admin" || !activeAdmin.active) {
    throw new Error(
      "Critical verification failure: Primary administrator hamzabitmesra786@gmail.com was modified or demoted!"
    );
  }

  console.log(`[Verification] Verified ${adminsPreserved} admin(s) intact; primary admin verified.`);
  console.log(`[Verification] Remaining interns: 0 in both tables.`);
  console.log("=== Migration Completed Successfully ===");

  return {
    rosterInternsUpdated,
    userInternsUpdated,
    adminsPreserved,
    remainingRosterInterns,
    remainingUserInterns,
  };
}

if (process.argv[1]?.endsWith("migrateInternsToMembers.ts")) {
  migrateInternsToMembers()
    .then((summary) => {
      console.log("Summary:", summary);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration failed:", err);
      process.exit(1);
    });
}
