import { eq, and, sql, desc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventoryItems, inventoryLedger, type InventoryItem } from "@/lib/db/schema/inventory";
import type {
  InventoryItemDto,
  InventoryItemPublicDto,
  PaginatedResponse,
} from "./types";
import type { ValidatedCatalogQuery } from "./validation";
import { enrichItemWithComputedStock } from "./quantity";

/**
 * Service function to retrieve a paginated inventory catalog.
 */
export async function listInventoryItems(
  query: ValidatedCatalogQuery,
  isAdmin: boolean
): Promise<PaginatedResponse<InventoryItemDto | InventoryItemPublicDto>> {
  const { page, limit } = query;
  const offset = (page - 1) * limit;

  // Base visibility: non-admins only see active items unless specifically querying
  const conditions = [];

  if (!isAdmin) {
    conditions.push(eq(inventoryItems.active, true));
    conditions.push(eq(inventoryItems.archived, false));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Fetch total count matching base conditions
  const [{ totalCount }] = await db
    .select({ totalCount: count() })
    .from(inventoryItems)
    .where(whereClause);

  const totalItems = Number(totalCount) || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  // Query records
  const rows = await db
    .select()
    .from(inventoryItems)
    .where(whereClause)
    .orderBy(desc(inventoryItems.createdAt))
    .limit(limit)
    .offset(offset);

  const enrichedItems = rows.map((row) =>
    enrichItemWithComputedStock(row, isAdmin)
  );

  return {
    items: enrichedItems,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
