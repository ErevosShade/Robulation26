import { NextResponse } from "next/server";
import { InventoryError } from "./errors";

/**
 * Formats inventory errors into consistent JSON responses.
 * Never leaks internal database connection details or stack traces.
 */
export function formatInventoryError(
  error: unknown,
  fallbackMessage = "An unexpected error occurred while processing inventory request."
): NextResponse {
  if (error instanceof InventoryError) {
    return NextResponse.json(
      {
        error: error.code,
        message: error.message,
        details: error.details,
      },
      { status: error.statusCode }
    );
  }

  console.error("[Inventory API Error]:", error);
  return NextResponse.json(
    {
      error: "INTERNAL_ERROR",
      message: fallbackMessage,
    },
    { status: 500 }
  );
}
