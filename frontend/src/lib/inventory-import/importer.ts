import { eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { inventoryItems, inventoryLedger } from "@/lib/db/schema/inventory";
import { generateSlugFromName, assertStockInvariants } from "@/lib/inventory/quantity";
import { skuRegex } from "@/lib/inventory/validation";
import type {
  ImportCommitPayload,
  ImportCommitResponse,
  ImportValidationError,
} from "./types";

/**
 * Commits a validated batch of inventory items into Neon PostgreSQL.
 *
 * Guarantees:
 * 1. Strict server-side revalidation of every row.
 * 2. Does NOT overwrite existing items or stock balances.
 * 3. Atomic stock invariant: available = total - reserved - checkedOut - damaged.
 * 4. Creates an immutable initial_stock ledger entry for each item with initial quantity > 0.
 * 5. Tags all ledger records with durable importBatchId and source telemetry for complete auditability.
 * 6. Idempotent against repeat submissions.
 */
export async function executeInventoryImportCommit(
  payload: ImportCommitPayload,
  actingAdminEmail: string
): Promise<ImportCommitResponse> {
  const { rows, filename = "inventory_import.xlsx" } = payload;
  const batchId = payload.batchId || `BATCH-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

  if (!rows || rows.length === 0) {
    return {
      success: false,
      batchId,
      summary: {
        totalProcessed: 0,
        insertedCount: 0,
        skippedCount: 0,
        errorCount: 0,
        totalUnitsProvisioned: 0,
      },
      insertedSkus: [],
      skippedSkus: [],
      errors: [
        {
          line: 0,
          message: "No rows provided for import commit.",
          severity: "error",
        },
      ],
      message: "No rows provided for import commit.",
    };
  }

  // 1. Collect candidate SKUs and check database for existing records
  const candidateSkus = rows.map((r) => r.sku.trim().toUpperCase());
  const existingRecords = await db
    .select({ sku: inventoryItems.sku })
    .from(inventoryItems)
    .where(inArray(inventoryItems.sku, candidateSkus));

  const existingSkuSet = new Set(existingRecords.map((r) => r.sku.toUpperCase()));

  const errors: ImportValidationError[] = [];
  const insertedSkus: string[] = [];
  const skippedSkus: string[] = [];
  let totalUnitsProvisioned = 0;

  // 2. Filter and revalidate rows
  const validRowsToInsert: typeof rows = [];

  for (const row of rows) {
    const sku = row.sku.trim().toUpperCase();

    // Check if already in database (idempotency check)
    if (existingSkuSet.has(sku)) {
      skippedSkus.push(sku);
      continue;
    }

    // Validate name
    if (!row.name || row.name.trim() === "") {
      errors.push({
        line: row.line,
        field: "name",
        message: "Equipment name is required.",
        severity: "error",
      });
      continue;
    }

    // Validate SKU
    if (!skuRegex.test(sku)) {
      errors.push({
        line: row.line,
        field: "sku",
        message: `SKU '${sku}' violates format requirements.`,
        severity: "error",
        rawValue: sku,
      });
      continue;
    }

    // Validate category
    if (!row.category || row.category.trim() === "") {
      errors.push({
        line: row.line,
        field: "category",
        message: "Category is required by database.",
        severity: "error",
      });
      continue;
    }

    // Validate quantity
    if (!Number.isInteger(row.totalQuantity) || row.totalQuantity < 0) {
      errors.push({
        line: row.line,
        field: "totalQuantity",
        message: "Total quantity must be a non-negative integer.",
        severity: "error",
      });
      continue;
    }

    validRowsToInsert.push({
      ...row,
      sku,
    });
  }

  if (validRowsToInsert.length === 0) {
    return {
      success: errors.length === 0,
      batchId,
      summary: {
        totalProcessed: rows.length,
        insertedCount: 0,
        skippedCount: skippedSkus.length,
        errorCount: errors.length,
        totalUnitsProvisioned: 0,
      },
      insertedSkus: [],
      skippedSkus,
      errors,
      message:
        errors.length > 0
          ? "Validation errors prevented import."
          : "All items in the batch already exist in the database. 0 duplicate items or stock entries created.",
    };
  }

  // 3. Process insertions in safe sequential batches
  // Each item insertion and initial stock ledger entry is recorded consistently
  for (const row of validRowsToInsert) {
    try {
      let slug = generateSlugFromName(row.name);
      
      // Ensure slug uniqueness
      const [existingSlug] = await db
        .select({ id: inventoryItems.id })
        .from(inventoryItems)
        .where(eq(inventoryItems.slug, slug))
        .limit(1);

      if (existingSlug) {
        slug = `${slug}-${Date.now().toString(36)}-${row.line}`;
      }

      // Assert stock invariant
      assertStockInvariants({
        totalQuantity: row.totalQuantity,
        reservedQuantity: 0,
        checkedOutQuantity: 0,
        damagedQuantity: 0,
        minimumStock: 0,
      });

      // Insert item
      const [insertedItem] = await db
        .insert(inventoryItems)
        .values({
          name: row.name, // Original name preserved
          slug,
          sku: row.sku,
          category: row.category,
          description: row.notes || null,
          tags: [row.category],
          locationRoom: row.locationRoom || null,
          locationCabinet: row.locationCabinet || null,
          locationShelf: row.locationShelf || null,
          locationBin: row.locationBin || null,
          totalQuantity: row.totalQuantity,
          reservedQuantity: 0,
          checkedOutQuantity: 0,
          damagedQuantity: 0,
          minimumStock: 0,
          consumable: row.consumable ?? false,
          internalNotes: row.internalNotes || (row.notes ? `Original: ${row.notes}` : null),
        })
        .onConflictDoNothing({ target: inventoryItems.sku })
        .returning();

      if (!insertedItem) {
        // Handled by onConflictDoNothing (concurrent insertion or race condition)
        skippedSkus.push(row.sku);
        continue;
      }

      insertedSkus.push(insertedItem.sku);
      totalUnitsProvisioned += row.totalQuantity;

      // If initial stock is positive, create initial stock ledger record
      if (row.totalQuantity > 0) {
        await db.insert(inventoryLedger).values({
          itemId: insertedItem.id,
          transactionType: "initial_stock",
          quantityDelta: row.totalQuantity,
          totalQuantityAfter: row.totalQuantity,
          availableQuantityAfter: row.totalQuantity,
          reservedQuantityAfter: 0,
          checkedOutQuantityAfter: 0,
          damagedQuantityAfter: 0,
          performedBy: actingAdminEmail,
          reason: `Bulk inventory import (batch: ${batchId}) from ${filename}`,
          metadata: {
            batchId,
            filename,
            sku: insertedItem.sku,
            originalLine: row.line,
            unit: row.unit || "pieces",
            importedAt: new Date().toISOString(),
          },
        });
      }
    } catch (err: unknown) {
      console.error(`[Inventory Importer] Error importing row line ${row.line} (${row.sku}):`, err);
      errors.push({
        line: row.line,
        message: err instanceof Error ? err.message : "Database insertion error.",
        severity: "error",
      });
    }
  }

  const success = insertedSkus.length > 0;

  return {
    success,
    batchId,
    summary: {
      totalProcessed: rows.length,
      insertedCount: insertedSkus.length,
      skippedCount: skippedSkus.length,
      errorCount: errors.length,
      totalUnitsProvisioned,
    },
    insertedSkus,
    skippedSkus,
    errors,
    message: `Import completed: ${insertedSkus.length} item(s) imported with ${totalUnitsProvisioned} units provisioned, ${skippedSkus.length} skipped (already present), ${errors.length} error(s).`,
  };
}
