import { sendTelegramMessage } from "./client";
import type {
  TelegramConfig,
  TelegramSendResult,
  TelegramTestNotificationPayload,
  TelegramBorrowRequestNotificationPayload,
  TelegramBorrowRequestItemPayload,
  TelegramBorrowRequestReviewPayload,
  TelegramBorrowRequestCollectionPayload,
  TelegramBorrowRequestReturnPayload,
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

/**
 * Formats an HTML notification when an approved borrow request is collected by a member.
 * Strictly escapes all user-controlled text.
 */
export function formatBorrowRequestCollectionNotification(
  payload: TelegramBorrowRequestCollectionPayload
): string {
  const safeId = escapeTelegramHtml(payload.requestId);
  const safeRequesterName = escapeTelegramHtml(payload.requesterName);
  const safeRequesterEmail = escapeTelegramHtml(payload.requesterEmail);
  const safeCollectorName = escapeTelegramHtml(payload.collectorName);
  const safeCollectorEmail = escapeTelegramHtml(payload.collectorEmail);
  const safeProject = escapeTelegramHtml(payload.project);
  const safeNotes = escapeTelegramHtml(payload.notes);

  const collectedStr =
    payload.collectedAt instanceof Date
      ? payload.collectedAt.toISOString().slice(0, 19).replace("T", " ") + " UTC"
      : payload.collectedAt
      ? String(payload.collectedAt).slice(0, 19).replace("T", " ") + " UTC"
      : new Date().toISOString().slice(0, 19).replace("T", " ") + " UTC";

  const itemsList = payload.items
    .map((item: TelegramBorrowRequestItemPayload, index: number) => {
      const itemName = escapeTelegramHtml(item.name);
      const itemSku = escapeTelegramHtml(item.sku);
      return `  ${index + 1}. <b>${itemName}</b> (<code>${itemSku}</code>) — <b>${item.quantity} unit(s)</b>`;
    })
    .join("\n");

  const lines = [
    `📦 <b>HARDWARE COLLECTED BY MEMBER</b>`,
    `📡 <i>Robolution Mechatronics Lab</i>`,
    ``,
    `<b>Request ID:</b> <code>${safeId}</code>`,
    `<b>Status:</b> 🔵 <code>COLLECTED / CHECKED OUT</code>`,
    `<b>Requester:</b> ${safeRequesterName} (<code>${safeRequesterEmail}</code>)`,
    `<b>Collected By:</b> ${safeCollectorName} (<code>${safeCollectorEmail}</code>)`,
    `<b>Project / Purpose:</b> ${safeProject}`,
    `<b>Timestamp:</b> <code>${collectedStr}</code>`,
    ``,
    `<b>Components Physically Issued (${payload.items.length}):</b>`,
    itemsList,
  ];

  if (safeNotes) {
    lines.push(``, `<b>Collection Notes:</b> <i>${safeNotes}</i>`);
  }

  lines.push(
    ``,
    `🚀 <i>Stock moved from reserved to checked-out balance in lab ledger.</i>`
  );

  return lines.join("\n");
}

/**
 * Formats an HTML notification when hardware items are returned and condition-inspected.
 * Strictly escapes all user-controlled text.
 */
export function formatBorrowRequestReturnNotification(
  payload: TelegramBorrowRequestReturnPayload
): string {
  const safeId = escapeTelegramHtml(payload.requestId);
  const safeRequesterName = escapeTelegramHtml(payload.requesterName);
  const safeRequesterEmail = escapeTelegramHtml(payload.requesterEmail);
  const safeReturnerName = escapeTelegramHtml(payload.returnerName);
  const safeReturnerEmail = escapeTelegramHtml(payload.returnerEmail);
  const safeProject = escapeTelegramHtml(payload.project);
  const safeNotes = escapeTelegramHtml(payload.notes);

  const isFullReturn = payload.status === "returned";
  const badgeOutcome = isFullReturn
    ? "🟢 <code>RETURNED (COMPLETED)</code>"
    : "🟡 <code>PARTIALLY RETURNED</code>";

  const returnedStr =
    payload.returnedAt instanceof Date
      ? payload.returnedAt.toISOString().slice(0, 19).replace("T", " ") + " UTC"
      : payload.returnedAt
      ? String(payload.returnedAt).slice(0, 19).replace("T", " ") + " UTC"
      : new Date().toISOString().slice(0, 19).replace("T", " ") + " UTC";

  const itemsList = payload.items
    .map((item, index: number) => {
      const itemName = escapeTelegramHtml(item.name);
      const itemSku = escapeTelegramHtml(item.sku);
      const isGood = item.condition === "good";
      const conditionBadge = isGood ? "✅ <b>GOOD</b>" : "⚠️ <b>DAMAGED</b>";
      const itemNote = item.notes ? ` — <i>${escapeTelegramHtml(item.notes)}</i>` : "";
      return `  ${index + 1}. <b>${itemName}</b> (<code>${itemSku}</code>) — <b>${item.quantity} unit(s)</b> [${conditionBadge}]${itemNote}`;
    })
    .join("\n");

  const lines = [
    `📥 <b>HARDWARE RETURNED &amp; INSPECTED</b>`,
    `📡 <i>Robolution Mechatronics Lab</i>`,
    ``,
    `<b>Request ID:</b> <code>${safeId}</code>`,
    `<b>Request Status:</b> ${badgeOutcome}`,
    `<b>Requester:</b> ${safeRequesterName} (<code>${safeRequesterEmail}</code>)`,
    `<b>Returned By:</b> ${safeReturnerName} (<code>${safeReturnerEmail}</code>)`,
    `<b>Project / Purpose:</b> ${safeProject}`,
    `<b>Timestamp:</b> <code>${returnedStr}</code>`,
    ``,
    `<b>Items Processed in Return (${payload.items.length}):</b>`,
    itemsList,
  ];

  if (safeNotes) {
    lines.push(``, `<b>Batch Notes:</b> <i>${safeNotes}</i>`);
  }

  lines.push(
    ``,
    `🔄 <i>Stock balances and condition ledgers updated atomically.</i>`
  );

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
