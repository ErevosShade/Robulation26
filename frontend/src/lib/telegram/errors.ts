/**
 * Telegram Error Sanitization and Masking Utilities
 * Guarantees that bot tokens and sensitive webhook secrets are NEVER exposed in logs, API responses, or errors.
 */

const BOT_TOKEN_REGEX = /bot[0-9]{8,12}:[a-zA-Z0-9_-]{30,50}/gi;
const BARE_TOKEN_REGEX = /[0-9]{8,12}:[a-zA-Z0-9_-]{30,50}/g;

/**
 * Strips or redacts any Telegram bot tokens from strings, error messages, or URLs.
 */
export function maskTelegramToken(raw: string, explicitToken?: string): string {
  if (!raw || typeof raw !== "string") {
    return "";
  }

  let sanitized = raw;

  if (explicitToken && explicitToken.length > 5) {
    sanitized = sanitized.split(explicitToken).join("[REDACTED_BOT_TOKEN]");
  }

  sanitized = sanitized.replace(BOT_TOKEN_REGEX, "bot[REDACTED_BOT_TOKEN]");
  sanitized = sanitized.replace(BARE_TOKEN_REGEX, "[REDACTED_BOT_TOKEN]");

  return sanitized;
}

export interface SanitizedTelegramError {
  message: string;
  code: string;
}

/**
 * Converts any caught error into a safe, redacted object suitable for logging and client responses.
 */
export function sanitizeTelegramError(
  err: unknown,
  explicitToken?: string
): SanitizedTelegramError {
  if (!err) {
    return {
      message: "An unknown error occurred during Telegram communication.",
      code: "UNKNOWN_ERROR",
    };
  }

  const isAbort = (err as { name?: string })?.name === "AbortError";
  if (isAbort) {
    return {
      message: "Telegram request timed out after network deadline.",
      code: "TIMEOUT",
    };
  }

  const rawMessage = err instanceof Error ? err.message : String(err);
  const cleanMessage = maskTelegramToken(rawMessage, explicitToken);

  return {
    message: cleanMessage || "Telegram network communication failure.",
    code: "NETWORK_ERROR",
  };
}

/**
 * Safe fetch wrapper that enforces a deadline and automatically strips tokens on failure.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = 8000,
  tokenToMask?: string
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return res;
  } catch (err: unknown) {
    const sanitized = sanitizeTelegramError(err, tokenToMask);
    throw new Error(`${sanitized.code}: ${sanitized.message}`);
  } finally {
    clearTimeout(timeoutId);
  }
}
