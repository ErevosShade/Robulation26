import { eq, and, or, ilike, sql, desc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventoryItems, inventoryLedger, type InventoryItem } from "@/lib/db/schema/inventory";
import type {
  InventoryItemDto,
  InventoryItemPublicDto,
  PaginatedResponse,
} from "./types";
import type { ValidatedCatalogQuery, ValidatedCreateItemInput } from "./validation";
import {
  enrichItemWithComputedStock,
  assertStockInvariants,
  generateSlugFromName,
} from "./quantity";
import { InventoryError } from "./errors";

/**
 * Escapes SQL LIKE special wildcard characters (% and _).
 */
export function escapeLikePattern(pattern: string): string {
  return pattern.replace(/[%_\\]/g, "\\$&");
}

/**
 * Service function to retrieve a paginated inventory catalog with search,
 * plain-text category filtering, and status filtering.
 */
export async function listInventoryItems(
  query: ValidatedCatalogQuery,
  isAdmin: boolean
): Promise<PaginatedResponse<InventoryItemDto | InventoryItemPublicDto>> {
  const { page, limit, search, category, status } = query;
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

  // Filter by category (case-insensitive plain text)
  if (category && category.trim()) {
    conditions.push(ilike(inventoryItems.category, category.trim()));
  }

  // Filter by server-computed status
  if (status) {
    const availableExpr = sql`(${inventoryItems.totalQuantity} - (${inventoryItems.reservedQuantity} + ${inventoryItems.checkedOutQuantity} + ${inventoryItems.damagedQuantity}))`;

    if (status === "archived") {
      conditions.push(
        or(eq(inventoryItems.archived, true), eq(inventoryItems.active, false))
      );
    } else if (status === "out_of_stock") {
      conditions.push(
        and(
          eq(inventoryItems.archived, false),
          eq(inventoryItems.active, true),
          sql`${availableExpr} <= 0`
        )
      );
    } else if (status === "low_stock") {
      conditions.push(
        and(
          eq(inventoryItems.archived, false),
          eq(inventoryItems.active, true),
          sql`${availableExpr} > 0`,
          sql`${availableExpr} <= ${inventoryItems.minimumStock}`
        )
      );
    } else if (status === "in_stock") {
      conditions.push(
        and(
          eq(inventoryItems.archived, false),
          eq(inventoryItems.active, true),
          sql`${availableExpr} > ${inventoryItems.minimumStock}`
        )
      );
    }
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

/**
 * Service function to retrieve a single inventory item by ID or slug.
 */
export async function getItemById(
  idOrSlug: string,
  isAdmin: boolean
): Promise<InventoryItemDto | InventoryItemPublicDto | null> {
  const [row] = await db
    .select()
    .from(inventoryItems)
    .where(
      or(eq(inventoryItems.id, idOrSlug), eq(inventoryItems.slug, idOrSlug))
    )
    .limit(1);

  if (!row) {
    return null;
  }

  // Non-admins cannot access archived or deactivated items
  if (!isAdmin && (row.archived || !row.active)) {
    return null;
  }

  return enrichItemWithComputedStock(row, isAdmin);
}

/**
 * Service function to create a new inventory item.
 * Admin-only operation. Validates SKU uniqueness, asserts stock invariants,
 * and creates an initial stock ledger entry when quantity > 0.
 */
export async function createInventoryItem(
  input: ValidatedCreateItemInput,
  actingAdminEmail: string
): Promise<InventoryItemDto> {
  // 1. Check SKU uniqueness
  const [existingSku] = await db
    .select({ id: inventoryItems.id })
    .from(inventoryItems)
    .where(eq(inventoryItems.sku, input.sku))
    .limit(1);

  if (existingSku) {
    throw new InventoryError(
      "DUPLICATE_SKU",
      `An inventory item with SKU '${input.sku}' already exists.`,
      409
    );
  }

  // 2. Generate slug and ensure uniqueness
  let slug = input.slug || generateSlugFromName(input.name);
  const [existingSlug] = await db
    .select({ id: inventoryItems.id })
    .from(inventoryItems)
    .where(eq(inventoryItems.slug, slug))
    .limit(1);

  if (existingSlug) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  // 3. Assert initial stock invariants
  const totalQuantity = input.totalQuantity ?? 0;
  const minimumStock = input.minimumStock ?? 0;
  assertStockInvariants({
    totalQuantity,
    reservedQuantity: 0,
    checkedOutQuantity: 0,
    damagedQuantity: 0,
    minimumStock,
  });

  // 4. Create item
  const [createdItem] = await db
    .insert(inventoryItems)
    .values({
      name: input.name,
      slug,
      sku: input.sku,
      category: input.category,
      description: input.description ?? null,
      tags: input.tags ?? [],
      locationRoom: input.locationRoom ?? null,
      locationCabinet: input.locationCabinet ?? null,
      locationShelf: input.locationShelf ?? null,
      locationBin: input.locationBin ?? null,
      unitCost: input.unitCost ?? null,
      currency: input.currency ?? "INR",
      totalQuantity,
      reservedQuantity: 0,
      checkedOutQuantity: 0,
      damagedQuantity: 0,
      minimumStock,
      consumable: input.consumable ?? false,
      internalNotes: input.internalNotes ?? null,
    })
    .returning();

  // 5. If initial stock is positive, record initial ledger transaction
  if (totalQuantity > 0) {
    await db.insert(inventoryLedger).values({
      itemId: createdItem.id,
      transactionType: "initial_stock",
      quantityDelta: totalQuantity,
      totalQuantityAfter: totalQuantity,
      availableQuantityAfter: totalQuantity,
      reservedQuantityAfter: 0,
      checkedOutQuantityAfter: 0,
      damagedQuantityAfter: 0,
      performedBy: actingAdminEmail,
      reason: "Initial item creation and stock provisioning.",
      metadata: { sku: createdItem.sku },
    });
  }

  return enrichItemWithComputedStock(createdItem, true) as InventoryItemDto;
}
