if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { memberRoster } from "../lib/db/schema/roster";

async function seedAdmin() {
  const adminEmail = "hamzabitmesra786@gmail.com".toLowerCase().trim();
  const adminRole = "admin" as const;
  const adminName = "Hamza Khan (Admin)";

  console.log(`[Seed] Checking initial administrator in member_roster: ${adminEmail}`);

  try {
    const existing = await db
      .select()
      .from(memberRoster)
      .where(eq(memberRoster.email, adminEmail))
      .limit(1);

    if (existing.length > 0) {
      const current = existing[0];
      console.log(`[Seed] Record already exists with id=${current.id}, role=${current.role}, active=${current.active}`);

      if (current.role === adminRole && current.active === true) {
        console.log(`[Seed] Initial administrator is already provisioned and active. No changes required.`);
        return current;
      }

      console.log(`[Seed] Updating record to ensure active admin status...`);
      const [updated] = await db
        .update(memberRoster)
        .set({
          role: adminRole,
          active: true,
          updatedAt: new Date(),
        })
        .where(eq(memberRoster.id, current.id))
        .returning();

      console.log(`[Seed] Administrator updated successfully: id=${updated.id}, role=${updated.role}, active=${updated.active}`);
      return updated;
    }

    console.log(`[Seed] Inserting initial administrator into member_roster...`);
    const [inserted] = await db
      .insert(memberRoster)
      .values({
        id: crypto.randomUUID(),
        name: adminName,
        email: adminEmail,
        role: adminRole,
        active: true,
      })
      .returning();

    console.log(`[Seed] Administrator inserted successfully: id=${inserted.id}, role=${inserted.role}, active=${inserted.active}`);
    return inserted;
  } catch (error) {
    console.error(`[Seed] Failed to provision initial administrator:`, error);
    process.exit(1);
  }
}

seedAdmin().then(() => {
  console.log(`[Seed] Completed.`);
  process.exit(0);
});
