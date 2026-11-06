import { NextResponse, type NextRequest } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventoryLedger, inventoryItems } from "@/lib/db/schema/inventory";
import { requireInventoryRole } from "@/lib/auth";
import { itemIdParamSchema } from "@/lib/inventory/validation";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

/**
 * GET /api/inventory/[id]/ledger
 * Retrieves the complete append-only stock movement history for a hardware item.
 * Authorized for 'admin' and 'member'.
 */
export async function GET(req: NextRequest, context: RouteContext) {
  const authResult = await requireInventoryRole(["admin", "member"]);
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.error, message: authResult.message },
      { status: authResult.error === "UNAUTHENTICATED" ? 401 : 403 }
    );
  }

  const rawParams = await Promise.resolve(context.params);
  const parsedParam = itemIdParamSchema.safeParse(rawParams);

  if (!parsedParam.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "Invalid item identifier." },
      { status: 400 }
    );
  }

  try {
    // 1. Verify item exists
    const [item] = await db
      .select({
        id: inventoryItems.id,
        name: inventoryItems.name,
        sku: inventoryItems.sku,
        category: inventoryItems.category,
      })
      .from(inventoryItems)
      .where(eq(inventoryItems.id, parsedParam.data.id))
      .limit(1);

    if (!item) {
      return NextResponse.json(
        { error: "ITEM_NOT_FOUND", message: `Inventory item '${parsedParam.data.id}' was not found.` },
        { status: 404 }
      );
    }

    // 2. Fetch ledger history
    const entries = await db
      .select()
      .from(inventoryLedger)
      .where(eq(inventoryLedger.itemId, item.id))
      .orderBy(desc(inventoryLedger.createdAt));

    return NextResponse.json({
      success: true,
      item,
      entries,
    });
  } catch (error) {
    console.error("[API Inventory Ledger GET] Error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to retrieve stock ledger history." },
      { status: 500 }
    );
  }
}
