import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import { executeInventoryImportCommit } from "@/lib/inventory-import";
import type { ImportCommitPayload } from "@/lib/inventory-import";

export const dynamic = "force-dynamic";

/**
 * POST /api/inventory/admin/import/commit
 * Executes transactional bulk insertion of validated inventory rows into Neon PostgreSQL.
 * Admin-only operation.
 * Guaranteed stock invariant enforcement and initial stock ledger creation.
 */
export async function POST(req: NextRequest) {
  const authResult = await requireInventoryRole(["admin"]);
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.error, message: authResult.message },
      { status: authResult.error === "UNAUTHENTICATED" ? 401 : 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "BAD_REQUEST", message: "Malformed JSON request body." },
      { status: 400 }
    );
  }

  const payload = body as ImportCommitPayload;
  if (!payload || !Array.isArray(payload.rows) || payload.rows.length === 0) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "No inventory rows provided in payload." },
      { status: 400 }
    );
  }

  try {
    const result = await executeInventoryImportCommit(payload, authResult.user.email);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error: unknown) {
    console.error("[API Inventory Import Commit] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "IMPORT_COMMIT_ERROR",
        message: error instanceof Error ? error.message : "Failed to execute inventory import.",
      },
      { status: 500 }
    );
  }
}
