import { eq, and, or, ilike, sql, desc, count } from "drizzle-orm";
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
 * Escapes SQL LIKE special wildcard characters (% and _).
 */
export function escapeLikePattern(pattern: string): string {
  return pattern.replace(/[%_\\]/g, "\\$&");
}

/**
 * Service function to retrieve a paginated inventory catalog with search.
 */
export async function listInventoryItems(
  query: ValidatedCatalogQuery,
  isAdmin: boolean
): Promise<PaginatedResponse<InventoryItemDto | InventoryItemPublicDto>> {
  const { page, limit, search } = query;
  const offset = (page - 1) * limit;

  const conditions = [];

  // Base visibility: non-admins only see active items
  if (!isAdmin) {
    conditions.push(eq(inventoryItems.active, true));
    conditions.push(eq(inventoryItems.archived, false));
  }

  // Search by name, SKU, or slug
  if (search && search.trim()) {
    const escaped = escapeLikePattern(search.trim());
    const searchPattern = `%${escaped}%`;
    conditions.push(
      or(
        ilike(inventoryItems.name, searchPattern),
        ilike(inventoryItems.sku, searchPattern),
        ilike(inventoryItems.slug, searchPattern)
      )
    );
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
