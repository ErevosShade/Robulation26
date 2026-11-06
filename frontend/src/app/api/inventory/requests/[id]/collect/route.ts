import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import {
  requestIdParamSchema,
  collectRequestSchema,
} from "@/lib/inventory/validation";
import { collectBorrowRequest } from "@/lib/inventory/requests";
import { formatInventoryError } from "@/lib/inventory/formatError";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

/**
 * POST /api/inventory/requests/[id]/collect
 * Confirms collection of hardware items for an approved borrow request.
 *
 * Requirements:
 * - Restricted to authenticated 'admin' or 'member' roles.
 * - Server validates caller ownership (request owner or authorized admin).
 * - Request must be in 'approved' status.
 * - Transitions reserved stock to checked-out stock atomically.
 * - Records stock ledger entries and outbox event.
 * - Post-commit Telegram notification dispatched asynchronously.
 */
export async function POST(req: NextRequest, context: RouteContext) {
  // 1. Strictly enforce server-side authentication
  const authResult = await requireInventoryRole(["admin", "member"], req.headers);
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

  // 3. Parse optional collection body
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

  const parsedBody = collectRequestSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Invalid collection parameters.",
        details: parsedBody.error.format(),
      },
      { status: 400 }
    );
  }

  try {
    const result = await collectBorrowRequest(
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
    return formatInventoryError(error, "Failed to confirm hardware collection.");
  }
}
