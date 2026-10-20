import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import { getItemById, updateInventoryItem, archiveInventoryItem } from "@/lib/inventory/service";
import { itemIdParamSchema, updateItemSchema } from "@/lib/inventory/validation";
import { InventoryError } from "@/lib/inventory/errors";

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

/**
 * PATCH /api/inventory/[id]
 * Updates fields of an existing inventory item.
 * Strictly restricted to administrators ('admin').
 * Protects immutable fields and rejects invalid stock balance changes.
 */
export async function PATCH(req: NextRequest, context: RouteContext) {
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

  const parsedBody = updateItemSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Validation failed for item update.",
        details: parsedBody.error.format(),
      },
      { status: 400 }
    );
  }

  try {
    const updated = await updateInventoryItem(
      parsedParam.data.id,
      parsedBody.data,
      authResult.user.email
    );

    return NextResponse.json({
      success: true,
      message: "Inventory item updated successfully.",
      item: updated,
    });
  } catch (error) {
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

    console.error("[API Inventory PATCH [id]] Unexpected error:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Failed to update inventory item.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/inventory/[id]
 * Safely archives an inventory item (soft deletion).
 * Strictly restricted to administrators ('admin').
 * Refuses archival if there are active reservations or checkouts.
 */
export async function DELETE(req: NextRequest, context: RouteContext) {
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
    const archived = await archiveInventoryItem(
      parsedParam.data.id,
      authResult.user.email
    );

    return NextResponse.json({
      success: true,
      message: "Inventory item safely archived.",
      item: archived,
    });
  } catch (error) {
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

    console.error("[API Inventory DELETE [id]] Unexpected error:", error);
    return NextResponse.json(
      {
        error: "INTERNAL_ERROR",
        message: "Failed to archive inventory item.",
      },
      { status: 500 }
    );
  }
}
