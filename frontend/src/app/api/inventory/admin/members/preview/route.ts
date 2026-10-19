import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import { generateRosterPreview } from "@/lib/roster-import";

export const dynamic = "force-dynamic";

/**
 * POST /api/inventory/admin/members/preview
 * Protected admin-only endpoint to preview and validate a member roster CSV.
 * Causes ZERO mutations to the database.
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

    const preview = await generateRosterPreview(csvContent, actingAdminEmail);

    return NextResponse.json(preview, { status: 200 });
  } catch (error) {
    console.error("[API Roster Preview] Error:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while generating the preview.",
      },
      { status: 500 }
    );
  }
}
