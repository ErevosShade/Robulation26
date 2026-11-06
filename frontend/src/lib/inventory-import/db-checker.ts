import { inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventoryItems } from "@/lib/db/schema/inventory";

export interface ExistingItemSummary {
  id: string;
  name: string;
  sku: string;
  category: string;
  totalQuantity: number;
}

/**
 * Checks a batch of candidate SKUs and item names against the Neon database.
 * Returns existing records to prevent overwriting existing inventory items
 * and to prevent duplicate initial stock ledger events.
 */
export async function checkExistingDbInventory(
  candidateSkus: string[],
  candidateNames: string[]
): Promise<{
  skuMap: Map<string, ExistingItemSummary>;
  nameMap: Map<string, ExistingItemSummary>;
}> {
  const skuMap = new Map<string, ExistingItemSummary>();
  const nameMap = new Map<string, ExistingItemSummary>();

  const uniqueSkus = Array.from(new Set(candidateSkus.filter(Boolean)));
  const uniqueNames = Array.from(new Set(candidateNames.filter(Boolean)));

  if (uniqueSkus.length === 0 && uniqueNames.length === 0) {
    return { skuMap, nameMap };
  }

  // Query in chunks of 500 to stay well under query parameter boundaries
  const CHUNK_SIZE = 500;

  for (let i = 0; i < uniqueSkus.length; i += CHUNK_SIZE) {
    const chunk = uniqueSkus.slice(i, i + CHUNK_SIZE);
    const existing = await db
      .select({
        id: inventoryItems.id,
        name: inventoryItems.name,
        sku: inventoryItems.sku,
        category: inventoryItems.category,
        totalQuantity: inventoryItems.totalQuantity,
      })
      .from(inventoryItems)
      .where(inArray(inventoryItems.sku, chunk));

    for (const item of existing) {
      skuMap.set(item.sku.toUpperCase(), item);
    }
  }

  for (let i = 0; i < uniqueNames.length; i += CHUNK_SIZE) {
    const chunk = uniqueNames.slice(i, i + CHUNK_SIZE);
    const existing = await db
      .select({
        id: inventoryItems.id,
        name: inventoryItems.name,
        sku: inventoryItems.sku,
        category: inventoryItems.category,
        totalQuantity: inventoryItems.totalQuantity,
      })
      .from(inventoryItems)
      .where(inArray(inventoryItems.name, chunk));

    for (const item of existing) {
      nameMap.set(item.name.toLowerCase().trim(), item);
    }
  }

  return { skuMap, nameMap };
}
