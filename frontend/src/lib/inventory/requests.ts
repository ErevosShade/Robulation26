import { eq, inArray } from "drizzle-orm";
import { db, type DbClient } from "@/lib/db";
import {
  inventoryRequests,
  inventoryRequestItems,
  type InventoryRequest,
  type InventoryRequestItem,
} from "@/lib/db/schema/requests";
import { inventoryItems } from "@/lib/db/schema/inventory";
import { computeAvailableQuantity } from "./quantity";
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

    const available = computeAvailableQuantity(dbItem);
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

/**
 * Lists borrowing requests according to the caller's role clearance.
 *
 * Members can view ONLY their own requests.
 * Admins can view requests across all members and filter by member or status.
 */
export async function listBorrowRequests(
  caller: RequestingUserContext,
  query: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: string;
  },
  client: DbClient = db
): Promise<{
  items: BorrowRequestDto[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}> {
  const page = Math.max(1, query.page || 1);
  const limit = Math.min(50, Math.max(1, query.limit || 10));
  const offset = (page - 1) * limit;

  // Strict ownership enforcement: non-admins are irrevocably locked to their own session user ID
  const filterUserId =
    caller.role === "admin" ? query.userId || undefined : caller.id;

  const conditions = [];

  if (filterUserId) {
    conditions.push(eq(inventoryRequests.userId, filterUserId));
  }

  if (query.status && query.status !== "all") {
    conditions.push(eq(inventoryRequests.status, query.status));
  }

  const whereClause =
    conditions.length === 0
      ? undefined
      : conditions.length === 1
      ? conditions[0]
      : (await import("drizzle-orm")).and(...conditions);

  // 1. Get total count
  const [{ count }] = await client
    .select({ count: (await import("drizzle-orm")).count() })
    .from(inventoryRequests)
    .where(whereClause);

  const totalItems = Number(count || 0);
  const totalPages = Math.ceil(totalItems / limit) || 1;

  if (totalItems === 0) {
    return {
      items: [],
      pagination: {
        page,
        limit,
        totalItems: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  // 2. Fetch paginated requests
  const requests = await client
    .select()
    .from(inventoryRequests)
    .where(whereClause)
    .orderBy((await import("drizzle-orm")).desc(inventoryRequests.createdAt))
    .limit(limit)
    .offset(offset);

  // 3. Fetch all request items in a single batch query
  const requestIds = requests.map((r) => r.id);
  const rawItems = await client
    .select({
      id: inventoryRequestItems.id,
      requestId: inventoryRequestItems.requestId,
      itemId: inventoryRequestItems.itemId,
      quantity: inventoryRequestItems.quantity,
      name: inventoryItems.name,
      sku: inventoryItems.sku,
      category: inventoryItems.category,
      locationRoom: inventoryItems.locationRoom,
      createdAt: inventoryRequestItems.createdAt,
    })
    .from(inventoryRequestItems)
    .innerJoin(inventoryItems, eq(inventoryRequestItems.itemId, inventoryItems.id))
    .where(inArray(inventoryRequestItems.requestId, requestIds));

  // Group items by requestId
  const itemsByRequestId = new Map<string, BorrowRequestItemDto[]>();
  for (const item of rawItems) {
    const list = itemsByRequestId.get(item.requestId) || [];
    list.push(item);
    itemsByRequestId.set(item.requestId, list);
  }

  // Construct DTOs
  const items: BorrowRequestDto[] = requests.map((r) => ({
    id: r.id,
    userId: r.userId,
    userEmail: r.userEmail,
    userName: r.userName,
    project: r.project,
    startDate: r.startDate,
    endDate: r.endDate,
    status: r.status as any,
    adminNotes: r.adminNotes,
    reviewedBy: r.reviewedBy,
    reviewedAt: r.reviewedAt,
    items: itemsByRequestId.get(r.id) || [],
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));

  return {
    items,
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
 * Retrieves a single borrow request by ID with strict ownership validation.
 */
export async function getBorrowRequestById(
  caller: RequestingUserContext,
  requestId: string,
  client: DbClient = db
): Promise<BorrowRequestDto | null> {
  const [request] = await client
    .select()
    .from(inventoryRequests)
    .where(eq(inventoryRequests.id, requestId))
    .limit(1);

  if (!request) {
    return null;
  }

  // Non-admins cannot inspect requests belonging to other members
  if (caller.role !== "admin" && request.userId !== caller.id) {
    throw new InventoryError(
      "FORBIDDEN_REQUEST_ACCESS",
      "You do not have authorization to view this borrowing request.",
      403
    );
  }

  const rawItems = await client
    .select({
      id: inventoryRequestItems.id,
      requestId: inventoryRequestItems.requestId,
      itemId: inventoryRequestItems.itemId,
      quantity: inventoryRequestItems.quantity,
      name: inventoryItems.name,
      sku: inventoryItems.sku,
      category: inventoryItems.category,
      locationRoom: inventoryItems.locationRoom,
      createdAt: inventoryRequestItems.createdAt,
    })
    .from(inventoryRequestItems)
    .innerJoin(inventoryItems, eq(inventoryRequestItems.itemId, inventoryItems.id))
    .where(eq(inventoryRequestItems.requestId, requestId));

  return {
    id: request.id,
    userId: request.userId,
    userEmail: request.userEmail,
    userName: request.userName,
    project: request.project,
    startDate: request.startDate,
    endDate: request.endDate,
    status: request.status as any,
    adminNotes: request.adminNotes,
    reviewedBy: request.reviewedBy,
    reviewedAt: request.reviewedAt,
    items: rawItems,
    createdAt: request.createdAt,
    updatedAt: request.updatedAt,
  };
}

