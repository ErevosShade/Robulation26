import { eq, and, or, ilike, sql, desc, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventoryItems, inventoryLedger, type InventoryItem } from "@/lib/db/schema/inventory";
import type {
  InventoryItemDto,
  InventoryItemPublicDto,
  PaginatedResponse,
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
} from "./types";
import type { ValidatedCatalogQuery } from "./validation";
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
  input: CreateInventoryItemInput,
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

/**
 * Service function to update an existing inventory item.
 * Admin-only operation. Validates stock invariants, prevents inconsistent
 * total reduction below committed stock, and logs stock adjustments in ledger.
 */
export async function updateInventoryItem(
  id: string,
  input: UpdateInventoryItemInput,
  actingAdminEmail: string
): Promise<InventoryItemDto> {
  const [existing] = await db
    .select()
    .from(inventoryItems)
    .where(eq(inventoryItems.id, id))
    .limit(1);

  if (!existing) {
    throw new InventoryError("ITEM_NOT_FOUND", `Inventory item '${id}' not found.`, 404);
  }

  const updates: Partial<InventoryItem> = {
    updatedAt: new Date(),
  };

  if (input.name !== undefined) updates.name = input.name;
  if (input.category !== undefined) updates.category = input.category;
  if (input.description !== undefined) updates.description = input.description;
  if (input.tags !== undefined) updates.tags = input.tags;
  if (input.locationRoom !== undefined) updates.locationRoom = input.locationRoom;
  if (input.locationCabinet !== undefined) updates.locationCabinet = input.locationCabinet;
  if (input.locationShelf !== undefined) updates.locationShelf = input.locationShelf;
  if (input.locationBin !== undefined) updates.locationBin = input.locationBin;
  if (input.unitCost !== undefined) updates.unitCost = input.unitCost;
  if (input.currency !== undefined) updates.currency = input.currency;
  if (input.minimumStock !== undefined) updates.minimumStock = input.minimumStock;
  if (input.consumable !== undefined) updates.consumable = input.consumable;
  if (input.internalNotes !== undefined) updates.internalNotes = input.internalNotes;

  let quantityDelta = 0;
  if (input.totalQuantity !== undefined && input.totalQuantity !== existing.totalQuantity) {
    const newTotal = input.totalQuantity;
    quantityDelta = newTotal - existing.totalQuantity;

    assertStockInvariants({
      totalQuantity: newTotal,
      reservedQuantity: existing.reservedQuantity,
      checkedOutQuantity: existing.checkedOutQuantity,
      damagedQuantity: existing.damagedQuantity,
      minimumStock: input.minimumStock ?? existing.minimumStock,
    });

    updates.totalQuantity = newTotal;
  }

  // Atomic conditional update ensuring concurrency protection against race conditions
  const updateConditions = [eq(inventoryItems.id, id)];
  if (input.totalQuantity !== undefined) {
    const newTotal = input.totalQuantity;
    updateConditions.push(
      sql`${newTotal} >= (${inventoryItems.reservedQuantity} + ${inventoryItems.checkedOutQuantity} + ${inventoryItems.damagedQuantity})`
    );
  }

  const [updatedItem] = await db
    .update(inventoryItems)
    .set(updates)
    .where(and(...updateConditions))
    .returning();

  if (!updatedItem) {
    throw new InventoryError(
      "INVALID_STOCK_OPERATION",
      "Unable to update item: concurrent stock operation prevented invariant-violating state.",
      409
    );
  }

  // If total quantity changed, record ledger adjustment
  if (quantityDelta !== 0) {
    const availableAfter =
      updatedItem.totalQuantity -
      (updatedItem.reservedQuantity +
        updatedItem.checkedOutQuantity +
        updatedItem.damagedQuantity);

    await db.insert(inventoryLedger).values({
      itemId: updatedItem.id,
      transactionType: "adjustment",
      quantityDelta,
      totalQuantityAfter: updatedItem.totalQuantity,
      availableQuantityAfter: availableAfter,
      reservedQuantityAfter: updatedItem.reservedQuantity,
      checkedOutQuantityAfter: updatedItem.checkedOutQuantity,
      damagedQuantityAfter: updatedItem.damagedQuantity,
      performedBy: actingAdminEmail,
      reason: `Admin stock adjustment (delta: ${quantityDelta > 0 ? `+${quantityDelta}` : quantityDelta}).`,
      metadata: { previousTotal: existing.totalQuantity, newTotal: updatedItem.totalQuantity },
    });
  }

  return enrichItemWithComputedStock(updatedItem, true) as InventoryItemDto;
}

/**
 * Concurrency-safe atomic stock adjustment.
 * Uses conditional SQL update to guarantee invariants hold under concurrent execution.
 */
export async function adjustItemStockAtomic(
  id: string,
  delta: number,
  reason: string,
  actingAdminEmail: string
): Promise<InventoryItemDto> {
  if (!Number.isInteger(delta) || delta === 0) {
    throw new InventoryError("INVALID_STOCK_OPERATION", "Delta must be a non-zero integer.", 400);
  }

  // Atomically update total_quantity only if total + delta >= committed stock and >= 0
  const [updated] = await db
    .update(inventoryItems)
    .set({
      totalQuantity: sql`${inventoryItems.totalQuantity} + ${delta}`,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(inventoryItems.id, id),
        sql`${inventoryItems.totalQuantity} + ${delta} >= 0`,
        sql`${inventoryItems.totalQuantity} + ${delta} >= (${inventoryItems.reservedQuantity} + ${inventoryItems.checkedOutQuantity} + ${inventoryItems.damagedQuantity})`
      )
    )
    .returning();

  if (!updated) {
    throw new InventoryError(
      "INVALID_STOCK_OPERATION",
      "Stock adjustment rejected: insufficient holdings or concurrent stock modification.",
      409
    );
  }

  const availableAfter =
    updated.totalQuantity -
    (updated.reservedQuantity + updated.checkedOutQuantity + updated.damagedQuantity);

  await db.insert(inventoryLedger).values({
    itemId: updated.id,
    transactionType: "adjustment",
    quantityDelta: delta,
    totalQuantityAfter: updated.totalQuantity,
    availableQuantityAfter: availableAfter,
    reservedQuantityAfter: updated.reservedQuantity,
    checkedOutQuantityAfter: updated.checkedOutQuantity,
    damagedQuantityAfter: updated.damagedQuantity,
    performedBy: actingAdminEmail,
    reason,
    metadata: { delta },
  });

  return enrichItemWithComputedStock(updated, true) as InventoryItemDto;
}

/**
 * Service function to safely archive an inventory item.
 * Admin-only soft deletion.
 * Refuses archival if there are active reserved or checked-out quantities.
 */
export async function archiveInventoryItem(
  id: string,
  actingAdminEmail: string,
  reason: string = "Admin archived item"
): Promise<InventoryItemDto> {
  const [existing] = await db
    .select()
    .from(inventoryItems)
    .where(eq(inventoryItems.id, id))
    .limit(1);

  if (!existing) {
    throw new InventoryError("ITEM_NOT_FOUND", `Inventory item '${id}' not found.`, 404);
  }

  // Active commitment guard: cannot archive an item with units in active use
  if (existing.reservedQuantity > 0 || existing.checkedOutQuantity > 0) {
    throw new InventoryError(
      "ACTIVE_COMMITMENTS_EXIST",
      `Cannot archive item '${existing.name}': it currently has ${existing.reservedQuantity} reserved and ${existing.checkedOutQuantity} checked-out unit(s).`,
      400
    );
  }

  const [archivedItem] = await db
    .update(inventoryItems)
    .set({
      archived: true,
      active: false,
      archivedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(inventoryItems.id, id))
    .returning();

  const availableAfter =
    archivedItem.totalQuantity -
    (archivedItem.reservedQuantity +
      archivedItem.checkedOutQuantity +
      archivedItem.damagedQuantity);

  await db.insert(inventoryLedger).values({
    itemId: archivedItem.id,
    transactionType: "archival",
    quantityDelta: 0,
    totalQuantityAfter: archivedItem.totalQuantity,
    availableQuantityAfter: availableAfter,
    reservedQuantityAfter: archivedItem.reservedQuantity,
    checkedOutQuantityAfter: archivedItem.checkedOutQuantity,
    damagedQuantityAfter: archivedItem.damagedQuantity,
    performedBy: actingAdminEmail,
    reason,
  });

  return enrichItemWithComputedStock(archivedItem, true) as InventoryItemDto;
}
