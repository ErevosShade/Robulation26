if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

process.env.TELEGRAM_MOCK_MODE = "true";

import { runBorrowValidationUnitTests } from "./testBorrowValidation";
import { runBorrowReviewUnitTests } from "./testBorrowReviewUnit";
import { runBorrowCollectionReturnUnitTests } from "./testBorrowCollectionReturnUnit";
import { runTelegramBorrowFormatterUnitTests } from "./testTelegramBorrowFormatter";
import { runOutboxTests } from "./testOutboxRetry";
import { runBorrowRequestsIntegrationTests } from "./testBorrowRequestsIntegration";
import { runBorrowListingAuthTests } from "./testBorrowListingAuth";
import { runBorrowApprovalIntegrationTests } from "./testBorrowApprovalIntegration";
import { runBorrowCollectionReturnIntegrationTests } from "./testBorrowCollectionReturnIntegration";

async function runAllBorrowRequestTests() {
  console.log("===============================================================");
  console.log("🚀 ROBOLUTION 2026 // BORROW REQUESTS & TELEGRAM TEST HARNESS");
  console.log("===============================================================\n");

  try {
    // Phase 1: Unit Validation Tests (Creation)
    runBorrowValidationUnitTests();

    // Phase 2: Unit Validation & Formatter Tests (Review)
    runBorrowReviewUnitTests();

    // Phase 3: Unit Validation & Formatter Tests (Collection & Returns)
    runBorrowCollectionReturnUnitTests();

    // Phase 4: Telegram Formatting & Mock Mode Tests
    await runTelegramBorrowFormatterUnitTests();

    // Phase 5: Outbox & Retry Tests
    await runOutboxTests();

    // Phase 6: Integration - Request Creation & Stock Invariants
    await runBorrowRequestsIntegrationTests();

    // Phase 7: Integration - Request Listing & Role Isolation
    await runBorrowListingAuthTests();

    // Phase 8: Integration - Request Approval, Rejection & Atomic Reservation
    await runBorrowApprovalIntegrationTests();

    // Phase 9: Integration - Member Collection, Returns & Invariant Reconciliation
    await runBorrowCollectionReturnIntegrationTests();

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
