import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import { requestIdParamSchema } from "@/lib/inventory/validation";
import { getBorrowRequestReturns } from "@/lib/inventory/requests";
import { formatInventoryError } from "@/lib/inventory/formatError";

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

/**
 * GET /api/inventory/requests/[id]/returns
 * Fetches all hardware return events and condition inspections for a borrow request.
 *
 * Requirements:
 * - Restricted to authenticated 'admin' or 'member' roles.
 * - Non-admins can only inspect returns for their own requests.
 * - Returns detailed condition logs, quantities, inspector/returner, and timestamps.
 */
export async function GET(req: NextRequest, context: RouteContext) {
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

  try {
    const returns = await getBorrowRequestReturns(
      {
        id: authResult.user.id,
        name: authResult.user.name,
        email: authResult.user.email,
        role: authResult.user.role,
      },
      parsedParam.data.id
    );

    return NextResponse.json(
      {
        success: true,
        returns,
      },
      { status: 200 }
    );
  } catch (error) {
    return formatInventoryError(error, "Failed to retrieve return history.");
  }
}
