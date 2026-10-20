import { NextResponse, type NextRequest } from "next/server";
import { requireInventoryRole } from "@/lib/auth";
import {
  isTelegramConfigured,
  getTelegramConfig,
  sendTelegramTestNotification,
} from "@/lib/telegram";

export const dynamic = "force-dynamic";

/**
 * Mask channel ID for display purposes (e.g., -100*****7890)
 */
function maskChannelId(channelId?: string): string {
  if (!channelId) return "Not configured";
  if (channelId.length <= 6) return "***";
  return `${channelId.slice(0, 4)}****${channelId.slice(-4)}`;
}

/**
 * GET /api/inventory/admin/telegram/test
 * Admin-only check to see if Telegram notifications are configured and active.
 */
export async function GET(req: NextRequest) {
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

  const config = getTelegramConfig();

  return NextResponse.json(
    {
      configured: config.isConfigured,
      targetChannel: maskChannelId(config.channelId),
    },
    { status: 200 }
  );
}

/**
 * POST /api/inventory/admin/telegram/test
 * Protected admin-only endpoint to send a connection test notification to the configured Telegram channel.
 *
 * Security:
 * - Strictly requires verified 'admin' role via server-side session and roster check.
 * - Does NOT accept arbitrary message text from the client (prevents open relay abuse).
 * - Pre-formats the notification with the authenticated admin's email and server timestamp.
 * - Never returns, logs, or leaks the bot token.
 */
export async function POST(req: NextRequest) {
  // 1. Strictly enforce server-side admin role
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

  // 2. Check if Telegram is configured
  if (!isTelegramConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "NOT_CONFIGURED",
        message: "Telegram integration is not configured. Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID.",
      },
      { status: 503 }
    );
  }

  // 3. Send test message
  const adminEmail = authResult.user.email;
  const result = await sendTelegramTestNotification(adminEmail);

  if (!result.success) {
    return NextResponse.json(
      {
        success: false,
        error: result.errorCode || "DELIVERY_FAILED",
        message: result.error || "Failed to deliver Telegram test message.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: "Telegram test notification sent successfully.",
      messageId: result.messageId,
      timestamp: result.timestamp,
    },
    { status: 200 }
  );
}
