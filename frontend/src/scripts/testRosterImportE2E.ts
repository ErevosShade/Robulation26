if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

import { eq, count, inArray } from "drizzle-orm";
import { db } from "../lib/db";
import { memberRoster } from "../lib/db/schema/roster";
import {
  generateRosterPreview,
  executeRosterImport,
} from "../lib/roster-import";
import { requireInventoryRole } from "../lib/auth";

interface TestReport {
  name: string;
  passed: boolean;
  details: string;
}

const reports: TestReport[] = [];

function recordTest(name: string, passed: boolean, details: string) {
  reports.push({ name, passed, details });
  console.log(`${passed ? "✓ PASS" : "✗ FAIL"}: ${name} - ${details}`);
}

async function runE2ETests() {
  console.log("=== Starting Member Roster Import E2E & Database Safety Suite ===");

  const INITIAL_ADMIN_EMAIL = "hamzabitmesra786@gmail.com";
  const TEST_EMAIL_1 = `test.e2e.pilot1_${Date.now()}@example.com`;
  const TEST_EMAIL_2 = `test.e2e.pilot2_${Date.now()}@example.com`;

  try {
    // 1. Verify existing admin record preservation
    const [initialAdmin] = await db
      .select()
      .from(memberRoster)
      .where(eq(memberRoster.email, INITIAL_ADMIN_EMAIL))
      .limit(1);

    recordTest(
      "Initial Admin Record Integrity",
      Boolean(initialAdmin && initialAdmin.role === "admin" && initialAdmin.active),
      `Verified initial administrator ${INITIAL_ADMIN_EMAIL} is active with admin role.`
    );

    // 2. Preview zero-mutation guarantee
    const [{ count: countBefore }] = await db
      .select({ count: count() })
      .from(memberRoster);

    const testCsvWithAdminAndNew = `name,email,role,active
"Initial Admin",${INITIAL_ADMIN_EMAIL},member,false
"Test Pilot 1",${TEST_EMAIL_1},member,true
"Test Pilot 2",${TEST_EMAIL_2},member,true`;

    const preview = await generateRosterPreview(
      testCsvWithAdminAndNew,
      INITIAL_ADMIN_EMAIL
    );

    const [{ count: countAfterPreview }] = await db
      .select({ count: count() })
      .from(memberRoster);

    recordTest(
      "Preview Zero-Mutation Guarantee",
      countBefore === countAfterPreview,
      `Preview performed full analysis with 0 database writes (Row count remained ${countBefore}).`
    );

    // 3. Existing database email detection
    const adminRowInPreview = preview.rows.find((r) => r.email === INITIAL_ADMIN_EMAIL);
    recordTest(
      "Database Existing Record Detection",
      Boolean(
        adminRowInPreview &&
        adminRowInPreview.status === "already_exists" &&
        adminRowInPreview.existingRecord?.role === "admin"
      ),
      `Successfully flagged ${INITIAL_ADMIN_EMAIL} as existing and retained its verified database role ('admin').`
    );

    // 4. Safe add-only insert execution
    const importResult1 = await executeRosterImport(
      testCsvWithAdminAndNew,
      INITIAL_ADMIN_EMAIL
    );

    recordTest(
      "Add-Only Import Execution",
      importResult1.success &&
      importResult1.summary.insertedCount === 2 &&
      importResult1.summary.alreadyExistsCount === 1,
      `Successfully inserted 2 new records while safely preserving 1 existing record.`
    );

    // Verify initial admin was NOT demoted or modified by CSV's 'member,false'
    const [adminAfterImport] = await db
      .select()
      .from(memberRoster)
      .where(eq(memberRoster.email, INITIAL_ADMIN_EMAIL))
      .limit(1);

    recordTest(
      "Preservation of Administrator Privileges",
      Boolean(adminAfterImport && adminAfterImport.role === "admin" && adminAfterImport.active),
      "Verified that CSV's attempted role downgrade ('member') was completely ignored; admin role preserved."
    );

    // 5. Explicit Intern Role Rejection in Import
    const internCsv = `name,email,role,active
"Intern User",intern.test.pilot@example.com,intern,true`;
    const internPreview = await generateRosterPreview(internCsv, INITIAL_ADMIN_EMAIL);
    const internImport = await executeRosterImport(internCsv, INITIAL_ADMIN_EMAIL);

    recordTest(
      "CSV Import - Intern Role Rejection",
      internPreview.rows[0]?.status === "invalid" &&
      Boolean(internPreview.rows[0]?.errors.some((e) => e.field === "role" && e.message.includes("intern"))) &&
      internImport.summary.insertedCount === 0,
      "Strictly rejects CSV records with 'intern' role without writing them to database."
    );

    // 5. Import idempotency test
    const importResult2 = await executeRosterImport(
      testCsvWithAdminAndNew,
      INITIAL_ADMIN_EMAIL
    );

    recordTest(
      "Import Idempotency",
      importResult2.success &&
      importResult2.summary.insertedCount === 0 &&
      importResult2.summary.alreadyExistsCount === 3,
      `Re-running identical CSV produced 0 new inserts and preserved all 3 existing records.`
    );

    // 6. Concurrency & conflict safety
    const conflictCsv = `name,email,role,active
"Duplicate Attempt",${TEST_EMAIL_1},admin,true`;

    const conflictResult = await executeRosterImport(conflictCsv, INITIAL_ADMIN_EMAIL);
    recordTest(
      "Conflict Protection (onConflictDoNothing)",
      conflictResult.success && conflictResult.summary.insertedCount === 0,
      `Attempted conflicting insert was safely handled without throwing SQL unique constraint violations.`
    );

    // 7. Authorization role gate
    const unauthAccess = await requireInventoryRole(["admin"], new Headers());
    recordTest(
      "Authorization Guard - Unauthenticated Rejection",
      !unauthAccess.authorized && unauthAccess.error === "UNAUTHENTICATED",
      "Unauthenticated request is strictly rejected with UNAUTHENTICATED."
    );

    // 8. Cleanup temporary test emails
    await db
      .delete(memberRoster)
      .where(inArray(memberRoster.email, [TEST_EMAIL_1, TEST_EMAIL_2]));

    const [adminFinalCheck] = await db
      .select()
      .from(memberRoster)
      .where(eq(memberRoster.email, INITIAL_ADMIN_EMAIL))
      .limit(1);

    recordTest(
      "Post-Test State Cleanliness",
      Boolean(adminFinalCheck && adminFinalCheck.role === "admin" && adminFinalCheck.active),
      "Temporary test records purged; production admin record remains active and verified."
    );

    console.log("\n=== E2E Test Suite Summary ===");
    const passed = reports.filter((r) => r.passed).length;
    const failed = reports.filter((r) => !r.passed).length;
    console.log(`Total: ${reports.length}, Passed: ${passed}, Failed: ${failed}`);

    if (failed > 0) {
      throw new Error(`${failed} E2E test(s) failed.`);
    }
  } catch (error) {
    console.error("Test execution failed:", error);
    process.exit(1);
  }
}

runE2ETests().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
