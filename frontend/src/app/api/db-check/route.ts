import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await db.execute(sql`SELECT 1 AS connected`);
    const rows = result.rows as Array<{ connected: number }>;
    const isConnected = rows.length > 0 && rows[0]?.connected === 1;

    if (!isConnected) {
      return NextResponse.json(
        {
          success: false,
          error: "Database check failed to verify connection",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Database connection verified successfully",
      data: {
        connected: rows[0].connected,
      },
    });
  } catch {
    console.error("Database connection check failed");
    return NextResponse.json(
      {
        success: false,
        error: "Failed to connect to database",
      },
      { status: 500 }
    );
  }
}
