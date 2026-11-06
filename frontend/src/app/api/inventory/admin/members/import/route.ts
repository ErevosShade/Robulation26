import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import { executeRosterImport } from "@/lib/roster-import";

export const dynamic = "force-dynamic";

/**
 * POST /api/inventory/admin/members/import
 * Protected admin-only endpoint to confirm and execute member roster CSV import.
 * Safely inserts new records with onConflictDoNothing and guarantees idempotency.
 */
export async function POST(req: NextRequest) {
  // 1. Strictly enforce server-side admin role
  const authResult = await requireInventoryRole(["admin"]);
  if (!authResult.authorized) {
    return NextResponse.json(
      {
        error: authResult.error,
        message: authResult.message,
      },
      { status: authResult.error === "UNAUTHENTICATED" ? 401 : 403 }
    );
  }

  const actingAdminEmail = authResult.user.email;

  try {
    let csvContent = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file || typeof file === "string") {
        return NextResponse.json(
          {
            error: "BAD_REQUEST",
            message: "Missing 'file' field in multipart form-data.",
          },
          { status: 400 }
        );
      }
      csvContent = await (file as File).text();
    } else {
      const body = await req.json();
      csvContent = body.csvContent ?? "";
    }

    if (!csvContent || typeof csvContent !== "string") {
      return NextResponse.json(
        {
          error: "BAD_REQUEST",
          message: "CSV content is required.",
        },
        { status: 400 }
      );
    }

    const result = await executeRosterImport(csvContent, actingAdminEmail);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("[API Roster Import] Error:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while executing the roster import.",
      },
      { status: 500 }
    );
  }
}
