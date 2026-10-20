import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import { getItemById } from "@/lib/inventory/service";
import { itemIdParamSchema } from "@/lib/inventory/validation";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

/**
 * GET /api/inventory/[id]
 * Retrieves full details for a single inventory item.
 * Authorized for 'admin' and 'member'.
 * Automatically omits internalNotes for non-admin callers.
 */
export async function GET(req: NextRequest, context: RouteContext) {
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
  const rawParams = await Promise.resolve(context.params);
  const parsedParam = itemIdParamSchema.safeParse(rawParams);

  if (!parsedParam.success) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Invalid item identifier.",
      },
      { status: 400 }
    );
  }

  try {
    const item = await getItemById(parsedParam.data.id, isAdmin);
    if (!item) {
      return NextResponse.json(
        {
          error: "ITEM_NOT_FOUND",
          message: `Inventory item '${parsedParam.data.id}' was not found.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error) {
    console.error("[API Inventory GET [id]] Error:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Failed to retrieve inventory item details.",
      },
      { status: 500 }
    );
  }
}
