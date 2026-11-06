import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import { generateInventoryImportPreview } from "@/lib/inventory-import";

export const dynamic = "force-dynamic";

/**
 * POST /api/inventory/admin/import/preview
 * Analyzes and generates a preview of an uploaded Excel or CSV inventory spreadsheet.
 * Admin-only operation.
 * Guaranteed 0 database writes.
 */
export async function POST(req: NextRequest) {
  const authResult = await requireInventoryRole(["admin"]);
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.error, message: authResult.message },
      { status: authResult.error === "UNAUTHENTICATED" ? 401 : 403 }
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let dataBuffer: Buffer;
    let filename = "inventory_import.xlsx";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file || !(file instanceof Blob)) {
        return NextResponse.json(
          { error: "VALIDATION_ERROR", message: "No spreadsheet file uploaded." },
          { status: 400 }
        );
      }

      const fileObj = file as File;
      filename = fileObj.name || filename;
      const arrayBuf = await file.arrayBuffer();
      dataBuffer = Buffer.from(arrayBuf);
    } else {
      const body = await req.json();
      if (body.csvContent && typeof body.csvContent === "string") {
        dataBuffer = Buffer.from(body.csvContent, "utf8");
        filename = body.filename || "inventory_import.csv";
      } else if (body.fileBase64 && typeof body.fileBase64 === "string") {
        dataBuffer = Buffer.from(body.fileBase64, "base64");
        filename = body.filename || "inventory_import.xlsx";
      } else {
        return NextResponse.json(
          { error: "VALIDATION_ERROR", message: "Invalid payload: fileBase64, csvContent, or multipart file required." },
          { status: 400 }
        );
      }
    }

    const preview = await generateInventoryImportPreview(
      dataBuffer,
      filename,
      authResult.user.email
    );

    return NextResponse.json({
      success: true,
      ...preview,
    });
  } catch (error: unknown) {
    console.error("[API Inventory Import Preview] Error:", error);
    return NextResponse.json(
      {
        error: "IMPORT_PREVIEW_ERROR",
        message: error instanceof Error ? error.message : "Failed to generate import preview.",
      },
      { status: 400 }
    );
  }
}
