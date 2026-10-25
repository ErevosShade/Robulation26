import { NextResponse } from "next/server";
import { sql, eq, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventoryItems } from "@/lib/db/schema/inventory";
import { inventoryRequests } from "@/lib/db/schema/requests";
import { requireInventoryRole } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET /api/inventory/stats
 * Returns authoritative hardware inventory statistics and request telemetry.
 * Authorized for 'admin' and 'member'.
 */
export async function GET() {
  const authResult = await requireInventoryRole(["admin", "member"]);
  if (!authResult.authorized) {
    return NextResponse.json(
      { error: authResult.error, message: authResult.message },
      { status: authResult.error === "UNAUTHENTICATED" ? 401 : 403 }
    );
  }

  try {
    // 1. Inventory items aggregations (active and non-archived items)
    const [stats] = await db
      .select({
        totalItems: sql<number>`count(*)::int`,
        totalUnits: sql<number>`coalesce(sum(${inventoryItems.totalQuantity}), 0)::int`,
        reservedUnits: sql<number>`coalesce(sum(${inventoryItems.reservedQuantity}), 0)::int`,
        checkedOutUnits: sql<number>`coalesce(sum(${inventoryItems.checkedOutQuantity}), 0)::int`,
        damagedUnits: sql<number>`coalesce(sum(${inventoryItems.damagedQuantity}), 0)::int`,
        availableUnits: sql<number>`coalesce(sum(
          ${inventoryItems.totalQuantity} - (
            ${inventoryItems.reservedQuantity} +
            ${inventoryItems.checkedOutQuantity} +
            ${inventoryItems.damagedQuantity}
          )
        ), 0)::int`,
        lowStockItems: sql<number>`count(
          case when (
            ${inventoryItems.totalQuantity} - (
              ${inventoryItems.reservedQuantity} +
              ${inventoryItems.checkedOutQuantity} +
              ${inventoryItems.damagedQuantity}
            ) > 0
            and ${inventoryItems.totalQuantity} - (
              ${inventoryItems.reservedQuantity} +
              ${inventoryItems.checkedOutQuantity} +
              ${inventoryItems.damagedQuantity}
            ) <= ${inventoryItems.minimumStock}
          ) then 1 else null end
        )::int`,
        outOfStockItems: sql<number>`count(
          case when (
            ${inventoryItems.totalQuantity} - (
              ${inventoryItems.reservedQuantity} +
              ${inventoryItems.checkedOutQuantity} +
              ${inventoryItems.damagedQuantity}
            ) <= 0
          ) then 1 else null end
        )::int`,
      })
      .from(inventoryItems)
      .where(and(eq(inventoryItems.archived, false), eq(inventoryItems.active, true)));

    // 2. Request summaries
    const [requestsSummary] = await db
      .select({
        pendingRequests: sql<number>`count(case when ${inventoryRequests.status} = 'pending' then 1 else null end)::int`,
        approvedRequests: sql<number>`count(case when ${inventoryRequests.status} = 'approved' then 1 else null end)::int`,
        collectedRequests: sql<number>`count(case when ${inventoryRequests.status} = 'collected' then 1 else null end)::int`,
        partiallyReturnedRequests: sql<number>`count(case when ${inventoryRequests.status} = 'partially_returned' then 1 else null end)::int`,
        totalActiveCheckouts: sql<number>`count(case when ${inventoryRequests.status} in ('collected', 'partially_returned') then 1 else null end)::int`,
      })
      .from(inventoryRequests);

    return NextResponse.json({
      success: true,
      stats: {
        totalItems: Number(stats?.totalItems ?? 0),
        totalUnits: Number(stats?.totalUnits ?? 0),
        availableUnits: Number(stats?.availableUnits ?? 0),
        reservedUnits: Number(stats?.reservedUnits ?? 0),
        checkedOutUnits: Number(stats?.checkedOutUnits ?? 0),
        damagedUnits: Number(stats?.damagedUnits ?? 0),
        lowStockItems: Number(stats?.lowStockItems ?? 0),
        outOfStockItems: Number(stats?.outOfStockItems ?? 0),
        pendingRequests: Number(requestsSummary?.pendingRequests ?? 0),
        approvedRequests: Number(requestsSummary?.approvedRequests ?? 0),
        activeCheckouts: Number(requestsSummary?.totalActiveCheckouts ?? 0),
      },
    });
  } catch (error) {
    console.error("[API Inventory Stats] Error:", error);
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Failed to compute inventory statistics." },
      { status: 500 }
    );
  }
}
