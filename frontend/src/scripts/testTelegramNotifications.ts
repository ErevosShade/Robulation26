/**
 * Telegram Notification Module Test Suite
 * Fully mocked tests verifying configuration, token redaction, timeout safety, and delivery logic.
 * Guarantees zero real Telegram messages are sent during tests.
 */

import {
  getTelegramConfig,
  isTelegramConfigured,
  maskTelegramToken,
  sanitizeTelegramError,
} from "../lib/telegram";

interface TestReport {
  name: string;
  passed: boolean;
  details: string;
}

const reports: TestReport[] = [];

function recordTest(name: string, passed: boolean, details: string) {
  reports.push({ name, passed, details });
  console.log(`${passed ? "✓ PASS" : "✗ FAIL"}: ${name} - ${details}`);
}

export async function runConfigAndErrorMaskingTests() {
  console.log("=== Testing Telegram Configuration & Credential Masking ===");

  const FAKE_TOKEN = "1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ_testToken";
  const FAKE_CHANNEL = "-1001234567890";

  // 1. Config Detection: Both provided
  const fullConfig = getTelegramConfig({
    botToken: FAKE_TOKEN,
    channelId: FAKE_CHANNEL,
  });
  recordTest(
    "Config Detection - Valid Credentials",
    fullConfig.isConfigured === true &&
      fullConfig.botToken === FAKE_TOKEN &&
      fullConfig.channelId === FAKE_CHANNEL,
    "Correctly reports isConfigured=true when token and channelId are present."
  );

  // 2. Config Detection: Missing token
  const noToken = getTelegramConfig({
    botToken: "",
    channelId: FAKE_CHANNEL,
  });
  recordTest(
    "Config Detection - Missing Bot Token",
    noToken.isConfigured === false && noToken.botToken === undefined,
    "Reports isConfigured=false and undefined botToken when token is empty string."
  );

  // 3. Config Detection: Missing channel ID
  const noChannel = getTelegramConfig({
    botToken: FAKE_TOKEN,
    channelId: "",
  });
  recordTest(
    "Config Detection - Missing Channel ID",
    noChannel.isConfigured === false && noChannel.channelId === undefined,
    "Reports isConfigured=false and undefined channelId when channelId is empty."
  );

  // 4. Config Sanitization: Whitespace & Quotes
  const messyConfig = getTelegramConfig({
    botToken: `  "${FAKE_TOKEN}"  `,
    channelId: ` '-1009876543210' `,
  });
  recordTest(
    "Config Sanitization - Whitespace & Enclosing Quotes",
    messyConfig.botToken === FAKE_TOKEN && messyConfig.channelId === "-1009876543210",
    "Properly strips outer quotes and leading/trailing whitespace from credentials."
  );

  // 5. Token Masking: URL redaction
  const leakUrl = `https://api.telegram.org/bot${FAKE_TOKEN}/sendMessage?chat_id=${FAKE_CHANNEL}`;
  const maskedUrl = maskTelegramToken(leakUrl, FAKE_TOKEN);
  recordTest(
    "Token Masking - Telegram API URL",
    !maskedUrl.includes(FAKE_TOKEN) && maskedUrl.includes("[REDACTED_BOT_TOKEN]"),
    `Replaces full bot token inside URLs with [REDACTED_BOT_TOKEN]. Result: ${maskedUrl}`
  );

  // 6. Token Masking: Generic Error Stack Trace
  const fakeError = new Error(
    `Network timeout while requesting https://api.telegram.org/bot${FAKE_TOKEN}/sendMessage`
  );
  const sanitized = sanitizeTelegramError(fakeError, FAKE_TOKEN);
  recordTest(
    "Error Sanitization - Exception Redaction",
    !sanitized.message.includes(FAKE_TOKEN) && sanitized.code === "NETWORK_ERROR",
    "Strips bot token from Error message and formats clean error code."
  );

  // 7. Timeout Abort Conversion
  const abortError = new Error("This operation was aborted");
  abortError.name = "AbortError";
  const sanitizedAbort = sanitizeTelegramError(abortError, FAKE_TOKEN);
  recordTest(
    "Error Sanitization - AbortError Timeout",
    sanitizedAbort.code === "TIMEOUT" &&
      sanitizedAbort.message.toLowerCase().includes("timed out"),
    "Recognizes fetch aborts and maps them to TIMEOUT error code."
  );
}

// Self-executing runner if invoked directly
if (process.argv[1]?.includes("testTelegramNotifications")) {
  runConfigAndErrorMaskingTests().then(() => {
    const failed = reports.filter((r) => !r.passed);
    console.log(`\nPart 1 Completed: ${reports.length} tests, ${failed.length} failures.`);
    if (failed.length > 0) process.exit(1);
  });
}
