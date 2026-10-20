import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/health
 * Public health check endpoint.
 * Strictly avoids exposing database credentials, hostnames, or connection strings.
 */
export async function GET() {
  let dbStatus = "connected";

  try {
    const result = await db.execute(sql`SELECT 1 AS alive`);
    const rows = result.rows as Array<{ alive: number }>;
    if (!rows || rows.length === 0 || rows[0]?.alive !== 1) {
      dbStatus = "unreachable";
    }
  } catch {
    dbStatus = "unreachable";
  }

  const isHealthy = dbStatus === "connected";

  return NextResponse.json(
    {
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
      },
    },
    { status: isHealthy ? 200 : 503 }
  );
}
