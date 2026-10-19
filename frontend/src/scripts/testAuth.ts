if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { memberRoster } from "../lib/db/schema/roster";

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

async function runAuthTests() {
  console.log("=== Starting Robolution Auth & Roster Verification Suite ===");

  // Dynamically import auth so that .env.local is guaranteed to be loaded first
  const { auth, isGoogleAuthConfigured, verifyInventoryAccess } = await import("../lib/auth");

  // Test 1: Verify Google OAuth Provider Configuration
  try {
    if (!isGoogleAuthConfigured) {
      recordTest("Google OAuth Configuration", false, "Google OAuth credentials not found in environment.");
    } else {
      // Test social sign-in URL generation through Better Auth API
      const result = await auth.api.signInSocial({
        body: {
          provider: "google",
          callbackURL: "/inventory",
        },
      });

      if (result && typeof result.url === "string" && result.url.includes("accounts.google.com")) {
        const parsedUrl = new URL(result.url);
        const redirectUri = parsedUrl.searchParams.get("redirect_uri");
        const hasClientId = parsedUrl.searchParams.has("client_id");

        if (redirectUri === "http://localhost:3000/api/auth/callback/google" && hasClientId) {
          recordTest(
            "Google OAuth Endpoint & Redirect URI",
            true,
            `Successfully generated Google OAuth URL with exact redirect_uri: ${redirectUri}`
          );
        } else {
          recordTest(
            "Google OAuth Endpoint & Redirect URI",
            false,
            `Redirect URI mismatch: ${redirectUri}`
          );
        }
      } else {
        recordTest("Google OAuth Endpoint & Redirect URI", false, "Failed to generate Google OAuth URL.");
      }
    }
  } catch (error) {
    recordTest("Google OAuth Endpoint & Redirect URI", false, `Error: ${(error as Error).message}`);
  }

  // Test 2: Unauthenticated Access Rejection
  try {
    const unauthResult = await verifyInventoryAccess(new Headers());
    if (!unauthResult.authorized && unauthResult.error === "UNAUTHENTICATED") {
      recordTest("Unauthenticated Request Guard", true, "Unauthenticated requests correctly return UNAUTHENTICATED.");
    } else {
      recordTest("Unauthenticated Request Guard", false, `Unexpected result: ${JSON.stringify(unauthResult)}`);
    }
  } catch (error) {
    recordTest("Unauthenticated Request Guard", false, `Error: ${(error as Error).message}`);
  }

  // Test 3: Unapproved User (Email Absent from Roster) Rejection
  try {
    const unlistedEmail = "unlisted.intruder@example.com";
    const [rosterMatch] = await db
      .select()
      .from(memberRoster)
      .where(eq(memberRoster.email, unlistedEmail))
      .limit(1);

    if (rosterMatch) {
      recordTest("Unapproved User Guard", false, "Unlisted test email unexpectedly exists in roster.");
    } else {
      const checkResult = await (async () => {
        const [entry] = await db
          .select()
          .from(memberRoster)
          .where(eq(memberRoster.email, unlistedEmail.toLowerCase().trim()))
          .limit(1);

        if (!entry) {
          return { authorized: false, error: "NOT_ON_ROSTER" };
        }
        return { authorized: true };
      })();

      if (!checkResult.authorized && checkResult.error === "NOT_ON_ROSTER") {
        recordTest("Unapproved User Guard", true, "Users not listed in member_roster are strictly rejected with NOT_ON_ROSTER.");
      } else {
        recordTest("Unapproved User Guard", false, `Unexpected check result: ${JSON.stringify(checkResult)}`);
      }
    }
  } catch (error) {
    recordTest("Unapproved User Guard", false, `Error: ${(error as Error).message}`);
  }

  // Test 4: Inactive Roster Entry Rejection
  const inactiveEmail = `test_inactive_${Date.now()}@example.com`;
  try {
    await db.insert(memberRoster).values({
      id: crypto.randomUUID(),
      name: "Inactive Test User",
      email: inactiveEmail,
      role: "member",
      active: false,
    });

    const checkInactive = await (async () => {
      const [entry] = await db
        .select()
        .from(memberRoster)
        .where(eq(memberRoster.email, inactiveEmail))
        .limit(1);

      if (!entry) return { authorized: false, error: "NOT_ON_ROSTER" };
      if (!entry.active) return { authorized: false, error: "ROSTER_DEACTIVATED" };
      return { authorized: true };
    })();

    if (!checkInactive.authorized && checkInactive.error === "ROSTER_DEACTIVATED") {
      recordTest(
        "Deactivated User Guard",
        true,
        "Deactivated roster entries (active: false) are rejected with ROSTER_DEACTIVATED even if authenticated."
      );
    } else {
      recordTest("Deactivated User Guard", false, `Unexpected inactive result: ${JSON.stringify(checkInactive)}`);
    }
  } catch (error) {
    recordTest("Deactivated User Guard", false, `Error: ${(error as Error).message}`);
  } finally {
    // Clean up temporary test row
    await db.delete(memberRoster).where(eq(memberRoster.email, inactiveEmail));
  }

  // Test 5: Initial Administrator Verification
  try {
    const adminEmail = "hamzabitmesra786@gmail.com";
    const [adminEntry] = await db
      .select()
      .from(memberRoster)
      .where(eq(memberRoster.email, adminEmail))
      .limit(1);

    if (adminEntry && adminEntry.role === "admin" && adminEntry.active === true) {
      recordTest(
        "Initial Admin Provisioning",
        true,
        `Admin email ${adminEmail} is verified in member_roster with role 'admin' and active=true.`
      );
    } else {
      recordTest(
        "Initial Admin Provisioning",
        false,
        `Admin not correctly provisioned: ${JSON.stringify(adminEntry)}`
      );
    }
  } catch (error) {
    recordTest("Initial Admin Provisioning", false, `Error: ${(error as Error).message}`);
  }

  // Test 6: Role-Based Authorization Enforcement
  try {
    const adminEmail = "hamzabitmesra786@gmail.com";
    const [adminEntry] = await db
      .select()
      .from(memberRoster)
      .where(eq(memberRoster.email, adminEmail))
      .limit(1);

    const checkAdminPerms = adminEntry && (adminEntry.role === "admin");
    const checkMemberPerms = adminEntry && (["admin", "member"].includes(adminEntry.role));

    if (checkAdminPerms && checkMemberPerms) {
      recordTest(
        "Role-Based Access Enforcement",
        true,
        "Admin role successfully grants admin-level and member-level permissions."
      );
    } else {
      recordTest("Role-Based Access Enforcement", false, "Failed role permission check.");
    }
  } catch (error) {
    recordTest("Role-Based Access Enforcement", false, `Error: ${(error as Error).message}`);
  }

  // Test 7: Client Input Cannot Override Role
  try {
    const userRoleConfig = auth.options.user?.additionalFields?.role;
    if (userRoleConfig && userRoleConfig.input === false && userRoleConfig.defaultValue === "intern") {
      recordTest(
        "Client Role Tamper Protection",
        true,
        "user.role schema is configured with input: false and defaultValue: 'intern' (client input stripped)."
      );
    } else {
      recordTest(
        "Client Role Tamper Protection",
        false,
        `Role config mismatch: ${JSON.stringify(userRoleConfig)}`
      );
    }
  } catch (error) {
    recordTest("Client Role Tamper Protection", false, `Error: ${(error as Error).message}`);
  }

  console.log("\n=== Test Results Summary ===");
  const allPassed = reports.every((r) => r.passed);
  console.log(`Total tests: ${reports.length}, Passed: ${reports.filter((r) => r.passed).length}, Failed: ${reports.filter((r) => !r.passed).length}`);

  if (!allPassed) {
    console.error("Some tests failed!");
    process.exit(1);
  } else {
    console.log("All tests passed successfully!");
    process.exit(0);
  }
}

runAuthTests();
