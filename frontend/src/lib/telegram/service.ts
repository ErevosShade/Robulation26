import { sendTelegramMessage } from "./client";
import type {
  TelegramConfig,
  TelegramSendResult,
  TelegramTestNotificationPayload,
} from "./types";

/**
 * Formats a clean HTML-formatted connection test message.
 */
export function formatConnectionTestMessage(payload: TelegramTestNotificationPayload): string {
  const env =
    payload.environment ||
    process.env.NODE_ENV ||
    "development";
  const timestamp = payload.serverTimestamp || new Date().toISOString();
  const safeEmail = payload.adminEmail.replace(/[<>&]/g, "");

  return [
    `🤖 <b>ROBOLUTION26 INVENTORY SYSTEM</b>`,
    `📡 <i>Telegram Notification Channel Verified</i>`,
    ``,
    `<b>Status:</b> Operational ✅`,
    `<b>Verified By:</b> <code>${safeEmail}</code>`,
    `<b>Timestamp:</b> <code>${timestamp}</code>`,
    `<b>Environment:</b> <code>${env}</code>`,
    ``,
    `Telemetry link active. Ready for inventory event notifications.`,
  ].join("\n");
}

/**
 * Sends a pre-formatted connection test notification to the configured channel.
 * High-level service function intended for admin connection testing.
 */
export async function sendTelegramTestNotification(
  adminEmail: string,
  configOverride?: Partial<TelegramConfig>
): Promise<TelegramSendResult> {
  const message = formatConnectionTestMessage({
    adminEmail,
    serverTimestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });

  return sendTelegramMessage(
    message,
    {
      parseMode: "HTML",
      disableWebPagePreview: true,
    },
    configOverride
  );
}
