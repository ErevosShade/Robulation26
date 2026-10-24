import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import { createBorrowRequestSchema } from "@/lib/inventory/validation";
import { createBorrowRequest } from "@/lib/inventory/requests";
import { formatInventoryError } from "@/lib/inventory/formatError";

export const dynamic = "force-dynamic";

/**
 * POST /api/inventory/requests
 * Submits a new hardware borrowing request.
 *
 * Requirements:
 * - Authorized for active 'admin' and 'member' roles.
 * - Supports multiple distinct components in a single request.
 * - Derives requesting user strictly from verified session.
 * - Atomically persists the request, requested items, and durable outbox notification.
 * - NEVER mutates stock quantities or stock ledger balances for pending requests.
 */
export async function POST(req: NextRequest) {
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      {
        error: "BAD_REQUEST",
        message: "Malformed JSON request body.",
      },
      { status: 400 }
    );
  }

  // Strictly sanitize: ignore/strip any client-supplied status, reviewer, or ID fields
  const parsed = createBorrowRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Invalid borrow request parameters.",
        details: parsed.error.format(),
      },
      { status: 400 }
    );
  }

  try {
    const result = await createBorrowRequest(
      {
        id: authResult.user.id,
        name: authResult.user.name,
        email: authResult.user.email,
        role: authResult.user.role,
      },
      parsed.data
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
      { status: 201 }
    );
  } catch (error) {
    return formatInventoryError(error, "Failed to submit borrow request.");
  }
}
