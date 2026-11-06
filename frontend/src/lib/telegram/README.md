# Telegram Notification Module

Server-only Telegram notification client and connection testing utilities for the Robolution26 inventory system.

## Public Exports (`@/lib/telegram`)

- `getTelegramConfig()`: Returns `{ botToken, channelId, isConfigured }` with trimmed, quotation-sanitized values.
- `isTelegramConfigured()`: Boolean helper to check if credentials are valid.
- `sendTelegramMessage(text, options, configOverride)`: Low-level message sender with 8s timeout and token masking.
- `sendTelegramTestNotification(adminEmail, configOverride)`: High-level connection test notification sender.
- `maskTelegramToken(raw, explicitToken)`: Strips bot token sequences from URLs, logs, or error strings.
- `sanitizeTelegramError(err, explicitToken)`: Converts unknown exceptions to safe `{ message, code }` objects.
- `formatConnectionTestMessage(payload)`: Generates clean HTML status message.

## Security Guarantees

1. Server-only execution.
2. Bot tokens are never echoed in logs, API responses, or error objects.
3. Test endpoint `POST /api/inventory/admin/telegram/test` requires `admin` role and sends pre-formatted status notifications without accepting arbitrary user text.
