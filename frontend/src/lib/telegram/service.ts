import { sendTelegramMessage } from "./client";
import type {
  TelegramConfig,
  TelegramSendResult,
  TelegramTestNotificationPayload,
  TelegramBorrowRequestNotificationPayload,
  TelegramBorrowRequestItemPayload,
  TelegramBorrowRequestReviewPayload,
} from "./types";



/**
 * Safely escapes user-supplied text for Telegram HTML parse mode.
 * Strictly prevents HTML tag injection, attribute breakouts, or formatting corruption.
 */
export function escapeTelegramHtml(text?: string | null): string {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}


/**
 * Formats a clean, tamper-proof HTML message for a new borrow request.
 * Strictly escapes all user-supplied text to prevent HTML injection attacks.
 */
export function formatBorrowRequestNotification(
  payload: TelegramBorrowRequestNotificationPayload
): string {
  const safeId = escapeTelegramHtml(payload.requestId);
  const safeName = escapeTelegramHtml(payload.requesterName);
  const safeEmail = escapeTelegramHtml(payload.requesterEmail);
  const safeProject = escapeTelegramHtml(payload.project);
  const startStr =
    payload.startDate instanceof Date
      ? payload.startDate.toISOString().slice(0, 10)
      : String(payload.startDate).slice(0, 10);
  const endStr =
    payload.endDate instanceof Date
      ? payload.endDate.toISOString().slice(0, 10)
      : String(payload.endDate).slice(0, 10);
  const safeStatus = escapeTelegramHtml(payload.status.toUpperCase());

  const itemsList = payload.items
    .map((item: TelegramBorrowRequestItemPayload, index: number) => {
      const itemName = escapeTelegramHtml(item.name);
      const itemSku = escapeTelegramHtml(item.sku);
      return `  ${index + 1}. <b>${itemName}</b> (<code>${itemSku}</code>) — <b>${item.quantity} unit(s)</b>`;
    })
    .join("\n");

  return [
    `📋 <b>NEW HARDWARE BORROW REQUEST</b>`,
    `📡 <i>Robolution Mechatronics Lab</i>`,
    ``,
    `<b>Request ID:</b> <code>${safeId}</code>`,
    `<b>Requester:</b> ${safeName} (<code>${safeEmail}</code>)`,
    `<b>Project / Purpose:</b> ${safeProject}`,
    `<b>Timeline:</b> <code>${startStr}</code> ➔ <code>${endStr}</code>`,
    `<b>Status:</b> 🟡 <code>${safeStatus}</code>`,
    ``,
    `<b>Requested Items (${payload.items.length}):</b>`,
    itemsList,
    ``,
    `<i>Review required in the Robolution inventory admin terminal.</i>`,
  ].join("\n");
}

/**
 * Formats an HTML notification for an approved or rejected borrow request.
 * Strictly escapes all user-supplied text.
 */
export function formatBorrowRequestReviewNotification(
  payload: TelegramBorrowRequestReviewPayload
): string {
  const isApproved = payload.decision === "approved";
  const icon = isApproved ? "✅" : "❌";
  const titleOutcome = isApproved ? "APPROVED &amp; RESERVED" : "REJECTED";
  const badgeOutcome = isApproved ? "🟢 <code>APPROVED</code>" : "🔴 <code>REJECTED</code>";

  const safeId = escapeTelegramHtml(payload.requestId);
  const safeRequesterName = escapeTelegramHtml(payload.requesterName);
  const safeRequesterEmail = escapeTelegramHtml(payload.requesterEmail);
  const safeReviewerName = escapeTelegramHtml(payload.reviewerName);
  const safeReviewerEmail = escapeTelegramHtml(payload.reviewerEmail);
  const safeProject = escapeTelegramHtml(payload.project);
  const safeNotes = escapeTelegramHtml(payload.adminNotes);

  const startStr =
    payload.startDate instanceof Date
      ? payload.startDate.toISOString().slice(0, 10)
      : String(payload.startDate).slice(0, 10);
  const endStr =
    payload.endDate instanceof Date
      ? payload.endDate.toISOString().slice(0, 10)
      : String(payload.endDate).slice(0, 10);

  const itemsList = payload.items
    .map((item: TelegramBorrowRequestItemPayload, index: number) => {
      const itemName = escapeTelegramHtml(item.name);
      const itemSku = escapeTelegramHtml(item.sku);
      return `  ${index + 1}. <b>${itemName}</b> (<code>${itemSku}</code>) — <b>${item.quantity} unit(s)</b>`;
    })
    .join("\n");

  const lines = [
    `${icon} <b>HARDWARE BORROW REQUEST ${titleOutcome}</b>`,
    `📡 <i>Robolution Mechatronics Lab</i>`,
    ``,
    `<b>Request ID:</b> <code>${safeId}</code>`,
    `<b>Status:</b> ${badgeOutcome}`,
    `<b>Requester:</b> ${safeRequesterName} (<code>${safeRequesterEmail}</code>)`,
    `<b>Reviewed By:</b> ${safeReviewerName} (<code>${safeReviewerEmail}</code>)`,
    `<b>Project / Purpose:</b> ${safeProject}`,
    `<b>Timeline:</b> <code>${startStr}</code> ➔ <code>${endStr}</code>`,
    ``,
    `<b>Components (${payload.items.length}):</b>`,
    itemsList,
  ];

  if (safeNotes) {
    lines.push(``, `<b>Review Note:</b> <i>${safeNotes}</i>`);
  }

  if (isApproved) {
    lines.push(``, `🔒 <i>Stock allocated to reservation balance in lab ledger.</i>`);
  }

  return lines.join("\n");
}


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
