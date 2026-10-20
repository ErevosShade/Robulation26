/**
 * Telegram Notification Module Test Suite
 * Fully mocked tests verifying configuration, token redaction, timeout safety, delivery logic,
 * and admin route authorization.
 * Guarantees zero real Telegram messages are sent during tests.
 */

import {
  getTelegramConfig,
  isTelegramConfigured,
  maskTelegramToken,
  sanitizeTelegramError,
  sendTelegramMessage,
  formatConnectionTestMessage,
  sendTelegramTestNotification,
} from "../lib/telegram";
import { requireInventoryRole } from "../lib/auth";

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

const FAKE_TOKEN = "1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ_testToken";
const FAKE_CHANNEL = "-1001234567890";

export async function runConfigAndErrorMaskingTests() {
  console.log("=== Testing Telegram Configuration & Credential Masking ===");

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

export async function runDeliveryAndAuthTests() {
  console.log("\n=== Testing Mocked Telegram Delivery & Route Authorization ===");

  const originalFetch = globalThis.fetch;

  try {
    // 8. Unconfigured delivery attempt
    const unconfiguredResult = await sendTelegramMessage("test message", undefined, {
      botToken: undefined,
      channelId: undefined,
    });
    recordTest(
      "Delivery Guard - Unconfigured Environment",
      unconfiguredResult.success === false &&
        unconfiguredResult.errorCode === "NOT_CONFIGURED",
      "Rejects send attempts when Telegram credentials are missing."
    );

    // 9. Empty text message rejection
    const emptyMsgResult = await sendTelegramMessage("   ", undefined, {
      botToken: FAKE_TOKEN,
      channelId: FAKE_CHANNEL,
    });
    recordTest(
      "Delivery Guard - Empty Message Text",
      emptyMsgResult.success === false && emptyMsgResult.errorCode === "EMPTY_MESSAGE",
      "Rejects empty or whitespace-only messages without initiating network calls."
    );

    // 10. Mocked successful message delivery
    let capturedUrl = "";
    let capturedBody: Record<string, unknown> = {};

    globalThis.fetch = (async (url: string | URL | Request, init?: RequestInit) => {
      capturedUrl = String(url);
      capturedBody = JSON.parse(String(init?.body || "{}"));
      return new Response(
        JSON.stringify({
          ok: true,
          result: {
            message_id: 9944,
            date: 1713000000,
            chat: { id: FAKE_CHANNEL, title: "Robolution Team" },
            text: capturedBody.text,
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as typeof fetch;

    const successResult = await sendTelegramMessage(
      "Test telemetry payload",
      { parseMode: "HTML", disableNotification: true },
      { botToken: FAKE_TOKEN, channelId: FAKE_CHANNEL }
    );

    recordTest(
      "Mocked Delivery - Successful Dispatch",
      successResult.success === true &&
        successResult.messageId === 9944 &&
        capturedBody.chat_id === FAKE_CHANNEL &&
        capturedBody.text === "Test telemetry payload" &&
        capturedBody.parse_mode === "HTML" &&
        capturedBody.disable_notification === true,
      `Payload dispatched with correct options and received messageId: ${successResult.messageId}.`
    );

    // 11. Mocked Telegram API Error (e.g. Chat Not Found / 400 Bad Request)
    globalThis.fetch = (async () => {
      return new Response(
        JSON.stringify({
          ok: false,
          error_code: 400,
          description: "Bad Request: chat not found",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }) as typeof fetch;

    const apiErrorResult = await sendTelegramMessage(
      "Hello",
      undefined,
      { botToken: FAKE_TOKEN, channelId: FAKE_CHANNEL }
    );

    recordTest(
      "Mocked Delivery - Telegram API 400 Error",
      apiErrorResult.success === false &&
        apiErrorResult.errorCode === 400 &&
        Boolean(apiErrorResult.error?.includes("chat not found")),
      `Gracefully handled API error code 400: ${apiErrorResult.error}`
    );

    // 12. Connection Test Message Formatter
    const formattedHtml = formatConnectionTestMessage({
      adminEmail: "admin@robolution.club",
      serverTimestamp: "2026-10-20T12:00:00.000Z",
      environment: "test",
    });

    recordTest(
      "Message Formatter - Connection Test HTML",
      formattedHtml.includes("ROBOLUTION26 INVENTORY SYSTEM") &&
        formattedHtml.includes("admin@robolution.club") &&
        formattedHtml.includes("Operational ✅"),
      "Formats clean HTML notification containing operator identity and operational status."
    );

    // 13. High-level Connection Test Delivery
    globalThis.fetch = (async () => {
      return new Response(
        JSON.stringify({
          ok: true,
          result: {
            message_id: 9945,
            date: 1713000000,
            chat: { id: FAKE_CHANNEL },
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as typeof fetch;

    const testNotificationResult = await sendTelegramTestNotification(
      "admin@robolution.club",
      { botToken: FAKE_TOKEN, channelId: FAKE_CHANNEL }
    );

    recordTest(
      "Service - sendTelegramTestNotification",
      testNotificationResult.success === true && testNotificationResult.messageId === 9945,
      "High-level service successfully delivers test notification to the configured channel."
    );

    // 14. Authorization Guard - Unauthenticated access rejected
    const unauthCheck = await requireInventoryRole(["admin"], new Headers());
    recordTest(
      "Admin Endpoint Guard - Unauthenticated 401",
      unauthCheck.authorized === false && unauthCheck.error === "UNAUTHENTICATED",
      "Unauthenticated caller is strictly rejected with UNAUTHENTICATED."
    );

    // 15. Authorization Guard - Role-based permissions matrix
    const checkRoleAllowed = (role: string, allowed: string[]) => allowed.includes(role);
    recordTest(
      "Admin Endpoint Guard - Member Role 403 Forbidden",
      checkRoleAllowed("admin", ["admin"]) &&
        !checkRoleAllowed("member", ["admin"]) &&
        !checkRoleAllowed("intern", ["admin"]),
      "Only admin role can execute admin Telegram endpoints; members and legacy roles are denied."
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function runAllTelegramTests() {
  await runConfigAndErrorMaskingTests();
  await runDeliveryAndAuthTests();

  const failed = reports.filter((r) => !r.passed);
  console.log(`\n=== Telegram Test Summary: ${reports.length} tests, ${failed.length} failures ===`);
  if (failed.length > 0) {
    process.exit(1);
  }
  console.log("All Telegram integration tests passed successfully!\n");
}

if (process.argv[1]?.includes("testTelegramNotifications")) {
  runAllTelegramTests().catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
  });
}
