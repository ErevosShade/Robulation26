import {
  reviewRequestSchema,
  requestIdParamSchema,
} from "../lib/inventory/validation";
import { formatBorrowRequestReviewNotification } from "../lib/telegram/service";
import type { TelegramBorrowRequestReviewPayload } from "../lib/telegram/types";

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

export function runBorrowReviewUnitTests() {
  console.log("=== Starting Borrow Request Review & Notification Unit Tests ===");

  // --- 1. reviewRequestSchema Tests ---

  // 1.1 Accept empty payload
  const emptyParsed = reviewRequestSchema.safeParse({});
  recordTest(
    "Review Schema - Accept Empty Body",
    emptyParsed.success && emptyParsed.data.adminNotes === undefined,
    "Empty review body successfully parses with undefined adminNotes."
  );

  // 1.2 Accept valid notes and trim whitespace
  const validNotesParsed = reviewRequestSchema.safeParse({
    adminNotes: "   Approved for deployment in lab 2. Handle with care.   ",
  });
  recordTest(
    "Review Schema - Trim and Accept Valid Admin Note",
    validNotesParsed.success &&
      validNotesParsed.data.adminNotes === "Approved for deployment in lab 2. Handle with care.",
    "Whitespace trimmed and note properly preserved."
  );

  // 1.3 Accept null notes
  const nullNotesParsed = reviewRequestSchema.safeParse({ adminNotes: null });
  recordTest(
    "Review Schema - Accept Null Admin Note",
    nullNotesParsed.success && (nullNotesParsed.data.adminNotes === null || nullNotesParsed.data.adminNotes === undefined),
    "Null adminNotes safely accepted."
  );

  // 1.4 Accept max length note (1000 characters)
  const exact1000 = "A".repeat(1000);
  const max1000Parsed = reviewRequestSchema.safeParse({ adminNotes: exact1000 });
  recordTest(
    "Review Schema - Accept 1000 Char Note",
    max1000Parsed.success && max1000Parsed.data.adminNotes?.length === 1000,
    "1000 character review note successfully validated."
  );

  // 1.5 Reject note exceeding 1000 characters
  const tooLong = "B".repeat(1001);
  const tooLongParsed = reviewRequestSchema.safeParse({ adminNotes: tooLong });
  recordTest(
    "Review Schema - Reject Exceeding 1000 Chars",
    !tooLongParsed.success,
    "Rejected note exceeding maximum allowed length."
  );

  // --- 2. requestIdParamSchema Tests ---

  const validParam = requestIdParamSchema.safeParse({ id: "req-f9c3-482a" });
  recordTest(
    "Request ID Param - Accept Valid ID",
    validParam.success && validParam.data.id === "req-f9c3-482a",
    "Valid request identifier accepted."
  );

  const emptyParam = requestIdParamSchema.safeParse({ id: "   " });
  recordTest(
    "Request ID Param - Reject Empty ID",
    !emptyParam.success,
    "Empty or whitespace-only ID rejected."
  );

  // --- 3. Telegram Review Notification Formatting Tests ---

  // 3.1 Approval Notification Format
  const approvalPayload: TelegramBorrowRequestReviewPayload = {
    requestId: "req-appr-001",
    decision: "approved",
    requesterName: "Dr. Elena Rostova <Lead>",
    requesterEmail: "elena@robolution.space",
    reviewerName: "Admin Commander",
    reviewerEmail: "admin@robolution.space",
    project: "Sub-orbital Avionics & Sensor Array <Mk II>",
    startDate: "2026-11-10T10:00:00Z",
    endDate: "2026-11-20T18:00:00Z",
    adminNotes: "Approved. Collect from Storage Bay 3.",
    items: [
      { name: "Pixhawk 6X Autopilot", sku: "FLT-PIX-001", quantity: 2 },
      { name: "Here3+ Precision GNSS", sku: "NAV-HERE3-01", quantity: 2 },
    ],
    reviewedAt: new Date("2026-10-24T12:00:00Z"),
  };

  const formattedApproval = formatBorrowRequestReviewNotification(approvalPayload);

  recordTest(
    "Approval Notification - Header & Status",
    formattedApproval.includes("BORROW REQUEST APPROVED") &&
      formattedApproval.includes("APPROVED &amp; RESERVED") &&
      formattedApproval.includes("req-appr-001"),
    "Approval message contains correct title, status badge, and request ID."
  );

  recordTest(
    "Approval Notification - Reviewer & Requester Metadata",
    formattedApproval.includes("Dr. Elena Rostova &lt;Lead&gt;") &&
      formattedApproval.includes("elena@robolution.space") &&
      formattedApproval.includes("Admin Commander") &&
      formattedApproval.includes("admin@robolution.space"),
    "Properly formats requester and reviewer metadata with escaped HTML."
  );

  recordTest(
    "Approval Notification - Reserved Stock Notice",
    formattedApproval.includes("Stock allocated to reservation balance in lab ledger.") &&
      formattedApproval.includes("Pixhawk 6X Autopilot") &&
      formattedApproval.includes("FLT-PIX-001") &&
      formattedApproval.includes("2 unit(s)"),
    "Accurately indicates stock reservation and lists all reserved hardware units."
  );

  recordTest(
    "Approval Notification - Admin Review Notes",
    formattedApproval.includes("Approved. Collect from Storage Bay 3."),
    "Includes reviewer notes."
  );

  // 3.2 Rejection Notification Format
  const rejectionPayload: TelegramBorrowRequestReviewPayload = {
    requestId: "req-rej-002",
    decision: "rejected",
    requesterName: "Astronaut Bob",
    requesterEmail: "bob@robolution.space",
    reviewerName: "Admin Supervisor",
    reviewerEmail: "supervisor@robolution.space",
    project: "Rover Wheel Stress Test <High Hazard>",
    startDate: "2026-11-01T08:00:00Z",
    endDate: "2026-11-03T18:00:00Z",
    adminNotes: "Declined: Insufficient spare parts for high-hazard testing.",
    items: [
      { name: "Titanium Chassis Strut", sku: "MECH-TITAN-01", quantity: 4 },
    ],
    reviewedAt: new Date("2026-10-24T12:30:00Z"),
  };

  const formattedRejection = formatBorrowRequestReviewNotification(rejectionPayload);

  recordTest(
    "Rejection Notification - Header & Status",
    formattedRejection.includes("HARDWARE BORROW REQUEST REJECTED") &&
      formattedRejection.includes("REJECTED") &&
      formattedRejection.includes("req-rej-002"),
    "Rejection message contains correct title, status badge, and request ID."
  );

  recordTest(
    "Rejection Notification - Zero Stock Movement Notice",
    !formattedRejection.includes("Stock allocated to reservation balance in lab ledger.") &&
      formattedRejection.includes("Declined: Insufficient spare parts for high-hazard testing."),
    "Accurately confirms zero stock reserved or altered upon rejection, includes rejection reason."
  );

  recordTest(
    "Rejection Notification - Neutralizes HTML Injections",
    formattedRejection.includes("&lt;High Hazard&gt;") &&
      !formattedRejection.includes("<High Hazard>"),
    "Successfully neutralizes raw HTML angle brackets in project description."
  );

  console.log("=== Review Validation & Notification Unit Tests Finished ===");
  const allPassed = reports.every((r) => r.passed);
  if (!allPassed) {
    throw new Error("One or more review unit tests failed.");
  }
}

// Allow direct CLI execution:
if (require.main === module || process.argv[1]?.endsWith("testBorrowReviewUnit.ts")) {
  try {
    runBorrowReviewUnitTests();
    console.log("All review unit tests passed successfully!");
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
}
