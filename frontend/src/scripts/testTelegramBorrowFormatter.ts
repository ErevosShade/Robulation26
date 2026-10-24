import {
  formatBorrowRequestNotification,
  escapeTelegramHtml,
  sendTelegramMessage,
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

export async function runTelegramBorrowFormatterUnitTests() {
  console.log("=== Starting Telegram Borrow Request Notification Unit Tests ===");

  // 1. Test HTML entity escaping
  const rawMaliciousInput = `<script>alert('XSS & Hack')</script> "test"`;
  const escaped = escapeTelegramHtml(rawMaliciousInput);
  recordTest(
    "HTML Entity Escaping",
    !escaped.includes("<") &&
      !escaped.includes(">") &&
      !escaped.includes('"') &&
      escaped.includes("&lt;script&gt;") &&
      escaped.includes("&amp;") &&
      escaped.includes("&quot;"),
    `Safely escaped dangerous HTML tags. Result: ${escaped}`
  );

  // 2. Test notification formatting with multi-item payload
  const mockPayload = {
    requestId: "req-uuid-test-99",
    requesterName: "Dr. Evelyn Reed",
    requesterEmail: "evelyn@robolution.space",
    project: "Autonomous LiDAR Mapping <Rover v2>",
    startDate: "2026-11-01T09:00:00Z",
    endDate: "2026-11-05T18:00:00Z",
    status: "pending",
    items: [
      { name: "Velodyne LiDAR VLP-16", sku: "SENS-LIDAR-01", quantity: 1 },
      { name: "STM32F401 Dev Board", sku: "MCU-STM32-02", quantity: 4 },
    ],
  };

  const formatted = formatBorrowRequestNotification(mockPayload);

  recordTest(
    "Notification Header & Metadata",
    formatted.includes("NEW HARDWARE BORROW REQUEST") &&
      formatted.includes("req-uuid-test-99") &&
      formatted.includes("Dr. Evelyn Reed") &&
      formatted.includes("evelyn@robolution.space") &&
      formatted.includes("PENDING"),
    "Message includes all mandatory telemetry header and requester fields."
  );

  recordTest(
    "HTML Injection Neutralization in Project Name",
    formatted.includes("&lt;Rover v2&gt;") && !formatted.includes("<Rover v2>"),
    "Successfully neutralized raw angle brackets in project description."
  );

  recordTest(
    "Requested Items List Formatting",
    formatted.includes("Velodyne LiDAR VLP-16") &&
      formatted.includes("SENS-LIDAR-01") &&
      formatted.includes("1 unit(s)") &&
      formatted.includes("STM32F401 Dev Board") &&
      formatted.includes("MCU-STM32-02") &&
      formatted.includes("4 unit(s)"),
    "Successfully formatted each item with name, SKU, and unit quantity."
  );

  // 3. Test Mock Mode delivery
  const mockSendResult = await sendTelegramMessage(
    formatted,
    { parseMode: "HTML" },
    { mockMode: true }
  );

  recordTest(
    "Telegram Mock Mode Execution",
    mockSendResult.success && mockSendResult.messageId === 888888,
    "Mock mode successfully short-circuits network calls and returns deterministic test ID."
  );

  // 4. Test empty message rejection in Mock Mode
  const emptyMockResult = await sendTelegramMessage("", {}, { mockMode: true });
  recordTest(
    "Reject Empty Message in Mock Mode",
    !emptyMockResult.success && emptyMockResult.errorCode === "EMPTY_MESSAGE",
    "Properly validates and rejects empty message text even in mock mode."
  );

  const passedCount = reports.filter((r) => r.passed).length;
  console.log(
    `=== Telegram Formatter Unit Tests Summary: ${passedCount}/${reports.length} passed ===\n`
  );

  if (passedCount !== reports.length) {
    throw new Error("One or more Telegram formatter unit tests failed.");
  }
}

if (process.argv[1]?.endsWith("testTelegramBorrowFormatter.ts")) {
  runTelegramBorrowFormatterUnitTests();
}
