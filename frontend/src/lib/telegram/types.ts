/**
 * Telegram Notification Module Types
 * Strictly server-side type definitions for Telegram Bot integration.
 */

export interface TelegramConfig {
  /** The Telegram Bot token issued by @BotFather */
  botToken?: string;
  /** The Telegram channel or supergroup chat ID (e.g. -100...) */
  channelId?: string;
  /** Whether both botToken and channelId are configured with non-empty values */
  isConfigured: boolean;
  /** Optional base URL override (used for testing or proxying) */
  apiBaseUrl?: string;
  /** Optional mock mode flag (skips external network requests in test/dev) */
  mockMode?: boolean;
}

export interface SendMessageOptions {
  /** Formatting parse mode: HTML or MarkdownV2 */
  parseMode?: "HTML" | "MarkdownV2" | "Markdown";
  /** Whether to disable link previews */
  disableWebPagePreview?: boolean;
  /** Whether to send notification silently (without sound) */
  disableNotification?: boolean;
}

export interface TelegramSendResult {
  /** Indicates whether the message was accepted by the Telegram API */
  success: boolean;
  /** The message ID assigned by Telegram if successful */
  messageId?: number;
  /** Sanitized error message (guaranteed free of bot tokens) */
  error?: string;
  /** Telegram API error code or internal code */
  errorCode?: number | string;
  /** ISO timestamp of the attempt */
  timestamp: string;
}

export interface TelegramApiResponse {
  ok: boolean;
  result?: {
    message_id: number;
    chat: {
      id: number | string;
      title?: string;
      type?: string;
    };
    date: number;
    text?: string;
  };
  description?: string;
  error_code?: number;
  parameters?: {
    retry_after?: number;
    migrate_to_chat_id?: number;
  };
}

export interface TelegramTestNotificationPayload {
  adminEmail: string;
  serverTimestamp?: string;
  environment?: string;
}

export interface TelegramBorrowRequestItemPayload {
  name: string;
  sku: string;
  quantity: number;
}

export interface TelegramBorrowRequestNotificationPayload {
  requestId: string;
  requesterName: string;
  requesterEmail: string;
  project: string;
  startDate: string | Date;
  endDate: string | Date;
  status: string;
  items: TelegramBorrowRequestItemPayload[];
  createdAt?: string | Date;
}

export interface TelegramBorrowRequestReviewPayload {
  requestId: string;
  decision: "approved" | "rejected";
  requesterName: string;
  requesterEmail: string;
  reviewerName: string;
  reviewerEmail: string;
  project: string;
  startDate: string | Date;
  endDate: string | Date;
  adminNotes?: string | null;
  items: TelegramBorrowRequestItemPayload[];
  reviewedAt?: string | Date;
}

export interface TelegramBorrowRequestCollectionPayload {
  requestId: string;
  requesterName: string;
  requesterEmail: string;
  collectorName: string;
  collectorEmail: string;
  project: string;
  items: TelegramBorrowRequestItemPayload[];
  notes?: string | null;
  collectedAt?: string | Date;
}

export interface TelegramReturnItemPayload {
  name: string;
  sku: string;
  quantity: number;
  condition: "good" | "damaged";
  notes?: string | null;
}

export interface TelegramBorrowRequestReturnPayload {
  requestId: string;
  requesterName: string;
  requesterEmail: string;
  returnerName: string;
  returnerEmail: string;
  project: string;
  status: string;
  items: TelegramReturnItemPayload[];
  notes?: string | null;
  returnedAt?: string | Date;
}


