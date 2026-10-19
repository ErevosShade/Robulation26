import { NextResponse } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import { getCsvTemplate } from "@/lib/roster-import";

export const dynamic = "force-dynamic";

/**
 * GET /api/inventory/admin/members/template
 * Download an RFC-4180 compliant CSV template for roster preloading.
 */
export async function GET() {
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

  const csvContent = getCsvTemplate(true);

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="robolution_roster_template.csv"',
      "Cache-Control": "no-store",
    },
  });
}
