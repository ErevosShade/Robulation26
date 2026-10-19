import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { memberRoster } from "@/lib/db/schema/roster";

export interface ExistingRosterRecord {
  id: string;
  name: string | null;
  email: string;
  role: string;
  active: boolean;
}

/**
 * Checks a list of emails against the member_roster table in Neon.
 * Read-only query; causes zero mutations to the database.
 */
export async function checkExistingRosterEmails(
  emails: string[]
): Promise<Map<string, ExistingRosterRecord>> {
  const existingMap = new Map<string, ExistingRosterRecord>();
  if (emails.length === 0) {
    return existingMap;
  }

  // Filter unique, non-empty emails
  const uniqueEmails = Array.from(new Set(emails.map((e) => e.trim().toLowerCase()))).filter(
    Boolean
  );

  // Batch in chunks of 200 to prevent oversized SQL IN-clauses
  const BATCH_SIZE = 200;
  for (let i = 0; i < uniqueEmails.length; i += BATCH_SIZE) {
    const chunk = uniqueEmails.slice(i, i + BATCH_SIZE);
    const records = await db
      .select({
        id: memberRoster.id,
        name: memberRoster.name,
        email: memberRoster.email,
        role: memberRoster.role,
        active: memberRoster.active,
      })
      .from(memberRoster)
      .where(inArray(memberRoster.email, chunk));

    for (const record of records) {
      existingMap.set(record.email.toLowerCase(), record);
    }
  }

  return existingMap;
}
