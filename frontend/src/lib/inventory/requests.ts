import { eq, inArray } from "drizzle-orm";
import { db, type DbClient } from "@/lib/db";
import {
  inventoryRequests,
  inventoryRequestItems,
  type InventoryRequest,
  type InventoryRequestItem,
} from "@/lib/db/schema/requests";
import { inventoryItems } from "@/lib/db/schema/inventory";
import { calculateAvailableQuantity } from "./quantity";
import { InventoryError } from "./errors";
import {
  formatBorrowRequestNotification,
  type TelegramBorrowRequestNotificationPayload,
} from "@/lib/telegram";
import { recordOutboxNotification, dispatchOutboxNotification } from "./outbox";
import type {
  ValidatedCreateBorrowRequestInput,
  BorrowRequestDto,
  BorrowRequestItemDto,
} from "./types";

export interface RequestingUserContext {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Creates a new borrowing request with its associated items.
 *
 * CRITICAL STOCK INVARIANT:
 * Submitting a pending request must NEVER reserve stock or mutate inventory
 * quantities or stock ledger balances. Availability is verified at submission time
 * to prevent impossible requests, but no stock is committed until future admin approval.
 */
export async function createBorrowRequest(
  user: RequestingUserContext,
  input: ValidatedCreateBorrowRequestInput,
  client: DbClient = db
): Promise<{
  request: BorrowRequestDto;
  outboxId?: string;
  notificationResult?: { success: boolean; error?: string };
}> {
  // 1. Validate chronological dates
  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new InventoryError("VALIDATION_ERROR", "Invalid date format provided.", 400);
  }

  if (endDate < startDate) {
    throw new InventoryError(
      "INVALID_DATE_RANGE",
      "Expected return date must be on or after requested checkout date.",
      400
    );
  }

  // 2. Validate items array is non-empty and has no duplicates
  if (!input.items || input.items.length === 0) {
    throw new InventoryError("VALIDATION_ERROR", "At least one item must be requested.", 400);
  }

  const requestedItemIds = input.items.map((i) => i.itemId);
  const uniqueIds = new Set(requestedItemIds);
  if (uniqueIds.size !== requestedItemIds.length) {
    throw new InventoryError(
      "DUPLICATE_REQUEST_ITEM",
      "Duplicate items are not permitted within a single borrow request.",
      400
    );
  }

  // 3. Fetch all requested inventory items
  const foundItems = await client
    .select()
    .from(inventoryItems)
    .where(inArray(inventoryItems.id, requestedItemIds));

  if (foundItems.length !== requestedItemIds.length) {
    const foundIdSet = new Set(foundItems.map((item) => item.id));
    const missing = requestedItemIds.filter((id) => !foundIdSet.has(id));
    throw new InventoryError(
      "ITEM_NOT_FOUND",
      `The following inventory items do not exist: ${missing.join(", ")}`,
      404
    );
  }

  // Map for fast lookups
  const itemsMap = new Map(foundItems.map((item) => [item.id, item]));

  // 4. Validate item active/archived status and stock availability
  const itemPayloadForTelegram: Array<{
    name: string;
    sku: string;
    quantity: number;
  }> = [];

  for (const requestedItem of input.items) {
    const dbItem = itemsMap.get(requestedItem.itemId)!;

    if (dbItem.archived) {
      throw new InventoryError(
        "ITEM_ARCHIVED",
        `Item '${dbItem.name}' (SKU: ${dbItem.sku}) is archived and cannot be borrowed.`,
        400
      );
    }

    if (!dbItem.active) {
      throw new InventoryError(
        "ITEM_NOT_FOUND",
        `Item '${dbItem.name}' (SKU: ${dbItem.sku}) is marked inactive.`,
        400
      );
    }

    if (requestedItem.quantity <= 0) {
      throw new InventoryError(
        "VALIDATION_ERROR",
        `Requested quantity for item '${dbItem.name}' must be greater than zero.`,
        400
      );
    }

    const available = calculateAvailableQuantity(dbItem);
    if (requestedItem.quantity > available) {
      throw new InventoryError(
        "INSUFFICIENT_STOCK",
        `Insufficient available stock for '${dbItem.name}' (SKU: ${dbItem.sku}). Requested: ${requestedItem.quantity}, Available: ${available}.`,
        400
      );
    }

    itemPayloadForTelegram.push({
      name: dbItem.name,
      sku: dbItem.sku,
      quantity: requestedItem.quantity,
    });
  }

  // 5. Persist request record
  const [createdRequest] = await client
    .insert(inventoryRequests)
    .values({
      userId: user.id,
      userEmail: user.email,
      userName: user.name,
      project: input.project.trim(),
      startDate,
      endDate,
      status: "pending",
    })
    .returning();

  // 6. Persist request items
  const createdItems = await client
    .insert(inventoryRequestItems)
    .values(
      input.items.map((item) => ({
        requestId: createdRequest.id,
        itemId: item.itemId,
        quantity: item.quantity,
      }))
    )
    .returning();

  // 7. Format Telegram notification and persist to outbox
  const telegramPayload: TelegramBorrowRequestNotificationPayload = {
    requestId: createdRequest.id,
    requesterName: user.name,
    requesterEmail: user.email,
    project: createdRequest.project,
    startDate,
    endDate,
    status: "pending",
    items: itemPayloadForTelegram,
    createdAt: createdRequest.createdAt,
  };

  const formattedMessage = formatBorrowRequestNotification(telegramPayload);

  const outboxRecord = await recordOutboxNotification(
    {
      channel: "telegram",
      eventType: "borrow_request_created",
      referenceId: createdRequest.id,
      payload: {
        ...telegramPayload,
        formattedMessage,
      },
    },
    client
  );

  // 8. Trigger immediate async dispatch (fire-and-forget or awaited safe side-effect)
  let notificationResult: { success: boolean; error?: string } | undefined;
  try {
    notificationResult = await dispatchOutboxNotification(outboxRecord.id, client);
  } catch (notifyErr: unknown) {
    // Delivery failure must NEVER crash or invalidate the successfully persisted request
    console.warn(
      `[BorrowRequest] Immediate notification dispatch error for request ${createdRequest.id}:`,
      notifyErr
    );
    notificationResult = {
      success: false,
      error: notifyErr instanceof Error ? notifyErr.message : "Notification error",
    };
  }

  // Construct and return response DTO
  const itemsDto: BorrowRequestItemDto[] = createdItems.map((ci) => {
    const dbItem = itemsMap.get(ci.itemId)!;
    return {
      id: ci.id,
      requestId: ci.requestId,
      itemId: ci.itemId,
      quantity: ci.quantity,
      name: dbItem.name,
      sku: dbItem.sku,
      category: dbItem.category,
      locationRoom: dbItem.locationRoom,
      createdAt: ci.createdAt,
    };
  });

  const requestDto: BorrowRequestDto = {
    id: createdRequest.id,
    userId: createdRequest.userId,
    userEmail: createdRequest.userEmail,
    userName: createdRequest.userName,
    project: createdRequest.project,
    startDate: createdRequest.startDate,
    endDate: createdRequest.endDate,
    status: createdRequest.status as any,
    adminNotes: createdRequest.adminNotes,
    reviewedBy: createdRequest.reviewedBy,
    reviewedAt: createdRequest.reviewedAt,
    items: itemsDto,
    createdAt: createdRequest.createdAt,
    updatedAt: createdRequest.updatedAt,
  };

  return {
    request: requestDto,
    outboxId: outboxRecord.id,
    notificationResult,
  };
}
