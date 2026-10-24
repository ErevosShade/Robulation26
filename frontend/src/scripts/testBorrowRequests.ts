if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

process.env.TELEGRAM_MOCK_MODE = "true";

import { runBorrowValidationUnitTests } from "./testBorrowValidation";
import { runTelegramBorrowFormatterUnitTests } from "./testTelegramBorrowFormatter";
import { runOutboxTests } from "./testOutboxRetry";
import { runBorrowRequestsIntegrationTests } from "./testBorrowRequestsIntegration";
import { runBorrowListingAuthTests } from "./testBorrowListingAuth";

async function runAllBorrowRequestTests() {
  console.log("===============================================================");
  console.log("🚀 ROBOLUTION 2026 // BORROW REQUESTS & TELEGRAM TEST HARNESS");
  console.log("===============================================================\n");

  try {
    // Phase 1: Unit Validation Tests
    runBorrowValidationUnitTests();

    // Phase 2: Telegram Formatting & Mock Mode Tests
    await runTelegramBorrowFormatterUnitTests();

    // Phase 3: Outbox & Retry Tests
    await runOutboxTests();

    // Phase 4: Integration - Request Creation & Stock Invariants
    await runBorrowRequestsIntegrationTests();

    // Phase 5: Integration - Request Listing & Role Isolation
    await runBorrowListingAuthTests();

    console.log("===============================================================");
    console.log("✨ ALL BORROW REQUEST & NOTIFICATION TEST SUITES PASSED! ✨");
    console.log("===============================================================");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Test harness encountered a failure:", err);
    process.exit(1);
  }
}

runAllBorrowRequestTests();
