/**
 * Live Telegram Connection Verification Script
 * Sends an authenticated test notification to the configured Telegram channel.
 * Reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID from .env.local.
 * Strictly avoids logging or exposing the bot token.
 */

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

import {
  isTelegramConfigured,
  getTelegramConfig,
  sendTelegramTestNotification,
} from "../lib/telegram";

async function verifyLiveConnection() {
  console.log("=== Verifying Live Telegram Bot Connection ===");

  const config = getTelegramConfig();

  if (!config.isConfigured || !config.botToken || !config.channelId) {
    console.warn(
      "[Telegram Verification] SKIPPED: TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID is missing from the environment."
    );
    console.warn("Set both variables in .env.local to enable live verification.");
    return { verified: false, reason: "NOT_CONFIGURED" };
  }

  const maskedChannel =
    config.channelId.length > 6
      ? `${config.channelId.slice(0, 4)}****${config.channelId.slice(-4)}`
      : "***";

  console.log(`Target Channel: ${maskedChannel}`);
  console.log("Dispatching connection test message via Telegram Bot API...");

  const adminEmail = process.env.ADMIN_EMAIL || "hamzabitmesra786@gmail.com";
  const result = await sendTelegramTestNotification(adminEmail);

  if (!result.success) {
    console.error("✗ FAILED: Telegram connection test failed.");
    console.error(`Error Code: ${result.errorCode}`);
    console.error(`Details: ${result.error}`);
    return { verified: false, error: result.error, code: result.errorCode };
  }

  console.log("✓ SUCCESS: Telegram connection verified!");
  console.log(`Message ID: ${result.messageId}`);
  console.log(`Dispatched at: ${result.timestamp}`);
  return { verified: true, messageId: result.messageId, timestamp: result.timestamp };
}

if (process.argv[1]?.includes("verifyTelegramLive")) {
  verifyLiveConnection().then((res) => {
    if (!res.verified && res.reason !== "NOT_CONFIGURED") {
      process.exit(1);
    }
  });
}

export { verifyLiveConnection };
