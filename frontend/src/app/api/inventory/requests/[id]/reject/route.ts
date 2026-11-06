import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import {
  requestIdParamSchema,
  reviewRequestSchema,
} from "@/lib/inventory/validation";
import { rejectBorrowRequest } from "@/lib/inventory/requests";
import { formatInventoryError } from "@/lib/inventory/formatError";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

/**
 * POST /api/inventory/requests/[id]/reject
 * Rejects a pending hardware borrow request.
 *
 * Requirements:
 * - Strictly restricted to authenticated users with 'admin' role.
 * - Permit rejection only for requests currently in 'pending' status.
 * - Accept an optional, validated admin review note.
 * - Atomically transition request status to 'rejected' without mutating inventory stock or creating stock ledger entries.
 * - Record rejection event into transactional outbox.
 * - Post-commit Telegram notification dispatched asynchronously.
 */
export async function POST(req: NextRequest, context: RouteContext) {
  // 1. Strictly enforce server-side admin role authorization
  const authResult = await requireInventoryRole(["admin"], req.headers);
  if (!authResult.authorized) {
    return NextResponse.json(
      {
        error: authResult.error,
        message: authResult.message,
      },
      { status: authResult.error === "UNAUTHENTICATED" ? 401 : 403 }
    );
  }

  // 2. Validate request ID parameter
  const rawParams = await Promise.resolve(context.params);
  const parsedParam = requestIdParamSchema.safeParse(rawParams);

  if (!parsedParam.success) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Invalid borrowing request identifier.",
      },
      { status: 400 }
    );
  }

  // 3. Parse optional review body
  let body: unknown = {};
  const textBody = await req.text();
  if (textBody && textBody.trim().length > 0) {
    try {
      body = JSON.parse(textBody);
    } catch {
      return NextResponse.json(
        {
          error: "BAD_REQUEST",
          message: "Malformed JSON request body.",
        },
        { status: 400 }
      );
    }
  }

  const parsedBody = reviewRequestSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Invalid review parameters.",
        details: parsedBody.error.format(),
      },
      { status: 400 }
    );
  }

  try {
    const result = await rejectBorrowRequest(
      {
        id: authResult.user.id,
        name: authResult.user.name,
        email: authResult.user.email,
        role: authResult.user.role,
      },
      parsedParam.data.id,
      parsedBody.data
    );

    return NextResponse.json(
      {
        success: true,
        request: result.request,
        notification: {
          dispatched: result.notificationResult?.success ?? false,
          outboxId: result.outboxId,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return formatInventoryError(error, "Failed to reject borrow request.");
  }
}
