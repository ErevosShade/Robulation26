import { NextResponse } from "next/server";
import { verifyInventoryAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await verifyInventoryAccess();

  if (!result.authorized) {
    return NextResponse.json(
      {
        authenticated: result.error !== "UNAUTHENTICATED",
        authorized: false,
        error: result.error,
        message: result.message,
      },
      { status: result.error === "UNAUTHENTICATED" ? 401 : 403 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    authorized: true,
    user: result.user,
    roster: {
      id: result.roster.id,
      name: result.roster.name,
      email: result.roster.email,
      role: result.roster.role,
      active: result.roster.active,
    },
  });
}
