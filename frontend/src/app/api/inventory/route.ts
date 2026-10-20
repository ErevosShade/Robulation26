import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import { catalogQuerySchema, createItemSchema } from "@/lib/inventory/validation";
import { listInventoryItems, createInventoryItem } from "@/lib/inventory/service";
import { formatInventoryError } from "@/lib/inventory/formatError";

export const dynamic = "force-dynamic";

/**
 * GET /api/inventory
 * Retrieves paginated catalog of hardware items.
 * Authorized for both 'admin' and 'member'.
 */
export async function GET(req: NextRequest) {
  const authResult = await requireInventoryRole(["admin", "member"]);
  if (!authResult.authorized) {
    return NextResponse.json(
      {
        error: authResult.error,
        message: authResult.message,
      },
      { status: authResult.error === "UNAUTHENTICATED" ? 401 : 403 }
    );
  }

  const isAdmin = authResult.user.role === "admin";
  const url = new URL(req.url);

  const queryParams = {
    page: url.searchParams.get("page") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    search: url.searchParams.get("search") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
  };

  const parsed = catalogQuerySchema.safeParse(queryParams);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Invalid catalog query parameters.",
        details: parsed.error.format(),
      },
      { status: 400 }
    );
  }

  try {
    const result = await listInventoryItems(parsed.data, isAdmin);
    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[API Inventory GET] Error:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Failed to retrieve inventory catalog.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/inventory
 * Creates a new hardware inventory item.
 * Strictly restricted to administrators ('admin').
 */
export async function POST(req: NextRequest) {
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: "BAD_REQUEST",
        message: "Malformed JSON request body.",
      },
      { status: 400 }
    );
  }

  const parsed = createItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Validation failed for new inventory item.",
        details: parsed.error.format(),
      },
      { status: 400 }
    );
  }

  try {
    const item = await createInventoryItem(parsed.data, authResult.user.email);
    return NextResponse.json(
      {
        success: true,
        message: "Inventory item created successfully.",
        item,
      },
      { status: 201 }
    );
  } catch (error) {
    return formatInventoryError(error, "Failed to create inventory item.");
  }
}
