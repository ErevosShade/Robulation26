import type {
  TelegramConfig,
  SendMessageOptions,
  TelegramSendResult,
  TelegramApiResponse,
} from "./types";
import { fetchWithTimeout, maskTelegramToken, sanitizeTelegramError } from "./errors";

/**
 * Sanitizes and loads Telegram configuration from server-side environment variables.
 * Safe to call repeatedly; does not log or expose the token.
 */
export function getTelegramConfig(override?: Partial<TelegramConfig>): TelegramConfig {
  const rawToken = override?.botToken ?? process.env.TELEGRAM_BOT_TOKEN;
  const rawChannelId = override?.channelId ?? process.env.TELEGRAM_CHANNEL_ID;
  const apiBaseUrl = override?.apiBaseUrl ?? process.env.TELEGRAM_API_BASE_URL ?? "https://api.telegram.org";

  const botToken = rawToken?.trim().replace(/^["']|["']$/g, "") || undefined;
  const channelId = rawChannelId?.trim().replace(/^["']|["']$/g, "") || undefined;

  const isConfigured = Boolean(botToken && channelId);
  const mockMode =
    override?.mockMode ??
    (process.env.TELEGRAM_MOCK_MODE === "true" ||
      process.env.TELEGRAM_MOCK_MODE === "1");

  return {
    botToken,
    channelId,
    isConfigured,
    apiBaseUrl,
    mockMode,
  };
}

/**
 * Checks whether Telegram notifications are enabled and configured in the environment.
 */
export function isTelegramConfigured(override?: Partial<TelegramConfig>): boolean {
  return getTelegramConfig(override).isConfigured;
}

/**
 * Sends a text message to the configured Telegram channel/group.
 * Server-only utility. Catches errors safely and never echoes the bot token.
 */
export async function sendTelegramMessage(
  text: string,
  options?: SendMessageOptions,
  configOverride?: Partial<TelegramConfig>
): Promise<TelegramSendResult> {
  const timestamp = new Date().toISOString();
  const config = getTelegramConfig(configOverride);

  if (config.mockMode) {
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return {
        success: false,
        error: "Message text cannot be empty.",
        errorCode: "EMPTY_MESSAGE",
        timestamp,
      };
    }
    return {
      success: true,
      messageId: 888888,
      timestamp,
    };
  }

  if (!config.isConfigured || !config.botToken || !config.channelId) {
    return {
      success: false,
      error: "Telegram notifications are not configured. TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID is missing.",
      errorCode: "NOT_CONFIGURED",
      timestamp,
    };
  }

  if (!text || typeof text !== "string" || text.trim().length === 0) {
    return {
      success: false,
      error: "Message text cannot be empty.",
      errorCode: "EMPTY_MESSAGE",
      timestamp,
    };
  }

  const endpoint = `${config.apiBaseUrl}/bot${config.botToken}/sendMessage`;

  const payload: Record<string, unknown> = {
    chat_id: config.channelId,
    text: text.trim(),
    parse_mode: options?.parseMode ?? "HTML",
    disable_web_page_preview: options?.disableWebPagePreview ?? true,
  };

  if (options?.disableNotification) {
    payload.disable_notification = true;
  }

  try {
    const response = await fetchWithTimeout(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
      8000,
      config.botToken
    );

    const data = (await response.json()) as TelegramApiResponse;

    if (!response.ok || !data.ok) {
      const description = maskTelegramToken(
        data.description || `HTTP ${response.status} ${response.statusText}`,
        config.botToken
      );
      return {
        success: false,
        error: description,
        errorCode: data.error_code || response.status,
        timestamp,
      };
    }

    return {
      success: true,
      messageId: data.result?.message_id,
      timestamp,
    };
  } catch (err: unknown) {
    const sanitized = sanitizeTelegramError(err, config.botToken);

    return {
      success: false,
      error: sanitized.message,
      errorCode: sanitized.code,
      timestamp,
    };
  }
}
