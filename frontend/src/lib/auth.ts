import { betterAuth, APIError } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { nextCookies } from "better-auth/next-js";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { user, session, account, verification } from "@/lib/db/schema/auth";
import { memberRoster, type MemberRoster } from "@/lib/db/schema/roster";

export type InventoryRole = "admin" | "member" | "intern";

// Sanitize Google OAuth credentials (strips accidentally pasted protocols or surrounding quotes)
const rawGoogleClientId = process.env.GOOGLE_CLIENT_ID?.trim()
  ?.replace(/^["']|["']$/g, "")
  ?.replace(/^https?:\/\//i, "");
const rawGoogleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim()
  ?.replace(/^["']|["']$/g, "");

const googleClientId = rawGoogleClientId || undefined;
const googleClientSecret = rawGoogleClientSecret || undefined;

/**
 * Indicates whether Google OAuth credentials are fully provided in environment variables.
 */
export const isGoogleAuthConfigured = Boolean(googleClientId && googleClientSecret);

if (!isGoogleAuthConfigured && process.env.NODE_ENV !== "test") {
  console.warn(
    "[Better Auth] Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET) are missing or incomplete. Google sign-in is disabled until credentials are configured."
  );
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL:
    process.env.BETTER_AUTH_URL ||
    (process.env.NODE_ENV === "production" ? undefined : "http://localhost:3000"),
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
    },
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "intern",
        input: false, // Ensures clients cannot supply or tamper with their role
      },
    },
  },
  socialProviders: isGoogleAuthConfigured
    ? {
        google: {
          clientId: googleClientId!,
          clientSecret: googleClientSecret!,
        },
      }
    : {},
  plugins: [nextCookies()],
  databaseHooks: {
    user: {
      create: {
        before: async (userData) => {
          const userEmail = (userData.email || "").toLowerCase().trim();

          if (!userEmail) {
            throw new APIError("BAD_REQUEST", {
              message: "An email address is required to register.",
            });
          }

          try {
            const [rosterEntry] = await db
              .select()
              .from(memberRoster)
              .where(eq(memberRoster.email, userEmail))
              .limit(1);

            // If the roster table exists and is readable, strictly enforce allowlist policy
            if (!rosterEntry) {
              throw new APIError("FORBIDDEN", {
                message:
                  "Sign-in restricted: Your email is not on the approved Robolution member roster.",
              });
            }

            if (!rosterEntry.active) {
              throw new APIError("FORBIDDEN", {
                message:
                  "Sign-in restricted: Your Robolution roster access has been deactivated by an administrator.",
              });
            }

            // Assign the verified roster role
            return {
              data: {
                ...userData,
                role: rosterEntry.role,
              },
            };
          } catch (error) {
            // Re-throw if it was our intentional FORBIDDEN/BAD_REQUEST APIError
            if (error instanceof APIError) {
              throw error;
            }

            // Fail-safe during initial setup: If the member_roster table has not yet been migrated,
            // default to 'intern' so developer setups are not completely bricked before migration.
            console.warn(
              "[Better Auth] member_roster table query failed during user creation (migrations may be pending). Defaulting role to 'intern'."
            );
            return {
              data: {
                ...userData,
                role: "intern",
              },
            };
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

async function resolveHeaders(providedHeaders?: Headers): Promise<Headers> {
  if (providedHeaders) {
    return providedHeaders;
  }
  try {
    const { headers } = await import("next/headers");
    const h = await headers();
    return h as unknown as Headers;
  } catch {
    return new Headers();
  }
}

/**
 * Retrieve the current authenticated session on the server.
 */
export async function getServerSession(reqHeaders?: Headers) {
  const resolved = await resolveHeaders(reqHeaders);
  return auth.api.getSession({ headers: resolved });
}

export type InventoryAccessResult =
  | {
      authorized: true;
      user: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
        role: InventoryRole;
      };
      roster: MemberRoster;
    }
  | {
      authorized: false;
      error:
        | "UNAUTHENTICATED"
        | "NOT_ON_ROSTER"
        | "ROSTER_DEACTIVATED"
        | "FORBIDDEN"
        | "DB_UNAVAILABLE";
      message: string;
    };

/**
 * Validates that:
 * 1. The user has an active, valid Better Auth session.
 * 2. The user's verified Google email is present on the admin-managed `member_roster` allowlist.
 * 3. The user's roster entry is active (`active === true`).
 *
 * If any check fails, access is strictly denied (fail-closed).
 * The effective role is ALWAYS derived from the live `member_roster` row.
 */
export async function verifyInventoryAccess(reqHeaders?: Headers): Promise<InventoryAccessResult> {
  const session = await getServerSession(reqHeaders);

  if (!session || !session.user || !session.user.email) {
    return {
      authorized: false,
      error: "UNAUTHENTICATED",
      message: "Authentication required to access inventory operations.",
    };
  }

  const userEmail = session.user.email.toLowerCase().trim();

  try {
    const [rosterEntry] = await db
      .select()
      .from(memberRoster)
      .where(eq(memberRoster.email, userEmail))
      .limit(1);

    if (!rosterEntry) {
      return {
        authorized: false,
        error: "NOT_ON_ROSTER",
        message: "Your account is not registered on the approved Robolution inventory roster.",
      };
    }

    if (!rosterEntry.active) {
      return {
        authorized: false,
        error: "ROSTER_DEACTIVATED",
        message: "Your roster access has been deactivated by an inventory administrator.",
      };
    }

    const validatedRole: InventoryRole =
      rosterEntry.role === "admin" || rosterEntry.role === "member" || rosterEntry.role === "intern"
        ? (rosterEntry.role as InventoryRole)
        : "intern";

    return {
      authorized: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
        role: validatedRole,
      },
      roster: rosterEntry,
    };
  } catch {
    // Fail closed if the database is unreachable or member_roster is not yet migrated
    return {
      authorized: false,
      error: "DB_UNAVAILABLE",
      message: "Failed to verify inventory access status against database.",
    };
  }
}

/**
 * Enforces role-based access control against the verified server-side roster role.
 */
export async function requireInventoryRole(
  allowedRoles: InventoryRole[],
  reqHeaders?: Headers
): Promise<InventoryAccessResult> {
  const access = await verifyInventoryAccess(reqHeaders);
  if (!access.authorized) {
    return access;
  }

  if (!allowedRoles.includes(access.user.role)) {
    return {
      authorized: false,
      error: "FORBIDDEN",
      message: `Access denied. Action requires one of the following roles: ${allowedRoles.join(", ")}.`,
    };
  }

  return access;
}
