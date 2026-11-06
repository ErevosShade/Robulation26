import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import { sanitizeCsvCell } from "@/lib/inventory-import/normalizers";
import type { ValidatedImportRow } from "@/lib/inventory-import/types";

export const dynamic = "force-dynamic";

/**
 * POST /api/inventory/admin/import/export-errors
 * Generates an exportable CSV report of invalid or warning rows with line numbers and reasons.
 * Protected against CSV formula injection (DDE attacks).
 * Admin-only operation.
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

  const { rows } = (body as { rows?: ValidatedImportRow[] }) || {};
  if (!rows || !Array.isArray(rows)) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "Missing rows array in request body." },
      { status: 400 }
    );
  }

  // Filter rows with errors or warnings
  const flaggedRows = rows.filter(
    (r) => r.status === "invalid" || r.status === "needs_review" || r.status === "already_exists" || r.errors.length > 0 || r.warnings.length > 0
  );

  const csvHeaders = ["Line", "Status", "Equipment Name", "SKU", "Category", "Quantity", "Unit", "Errors", "Warnings"];
  const csvLines: string[] = [csvHeaders.join(",")];

  for (const row of flaggedRows) {
    const errorText = row.errors.map((e) => e.message).join(" | ");
    const warningText = row.warnings.map((w) => w.message).join(" | ");

    const lineValues = [
      sanitizeCsvCell(row.line),
      sanitizeCsvCell(row.status),
      sanitizeCsvCell(row.name),
      sanitizeCsvCell(row.finalSku || row.originalSku),
      sanitizeCsvCell(row.finalCategory || row.originalCategory),
      sanitizeCsvCell(row.parsedQuantity),
      sanitizeCsvCell(row.parsedUnit),
      sanitizeCsvCell(errorText),
      sanitizeCsvCell(warningText),
    ];

    // Escape and quote CSV fields
    const escapedLine = lineValues.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",");
    csvLines.push(escapedLine);
  }

  const csvContent = csvLines.join("\r\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inventory_import_report_${Date.now()}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
