import {
  createBorrowRequestSchema,
  borrowRequestsQuerySchema,
  borrowRequestItemSchema,
} from "../lib/inventory/validation";

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

export function runBorrowValidationUnitTests() {
  console.log("=== Starting Borrow Request Validation Unit Tests ===");

  const validNow = new Date();
  const validTomorrow = new Date(Date.now() + 86400000);

  // 1. Valid payload
  const validPayload = {
    project: "Autonomous Mars Rover Navigation Subsystem",
    startDate: validNow.toISOString(),
    endDate: validTomorrow.toISOString(),
    items: [
      { itemId: "item-uuid-1", quantity: 2 },
      { itemId: "item-uuid-2", quantity: 5 },
    ],
  };

  const parsedValid = createBorrowRequestSchema.safeParse(validPayload);
  recordTest(
    "Valid Borrow Request Payload",
    parsedValid.success,
    parsedValid.success
      ? "Accepted valid multi-item borrow request payload."
      : `Failed: ${JSON.stringify(parsedValid.error.format())}`
  );

  // 2. Reject missing or empty project description
  const emptyProjectPayload = {
    ...validPayload,
    project: "   ",
  };
  const parsedEmptyProject = createBorrowRequestSchema.safeParse(emptyProjectPayload);
  recordTest(
    "Reject Empty Project Description",
    !parsedEmptyProject.success,
    "Strictly rejected empty/whitespace project description."
  );

  // 3. Reject end date before start date
  const invalidDatePayload = {
    ...validPayload,
    startDate: validTomorrow.toISOString(),
    endDate: validNow.toISOString(), // earlier than startDate
  };
  const parsedInvalidDate = createBorrowRequestSchema.safeParse(invalidDatePayload);
  recordTest(
    "Reject Inverted Date Range",
    !parsedInvalidDate.success &&
      Boolean(parsedInvalidDate.error.issues.some((i) => i.path.includes("endDate"))),
    "Strictly rejected request where expected return date is earlier than checkout date."
  );

  // 4. Accept same-day checkout and return
  const sameDayPayload = {
    ...validPayload,
    startDate: validNow.toISOString(),
    endDate: validNow.toISOString(),
  };
  const parsedSameDay = createBorrowRequestSchema.safeParse(sameDayPayload);
  recordTest(
    "Accept Same-Day Return",
    parsedSameDay.success,
    "Accepted same-day checkout and return."
  );

  // 5. Reject empty items array
  const emptyItemsPayload = {
    ...validPayload,
    items: [],
  };
  const parsedEmptyItems = createBorrowRequestSchema.safeParse(emptyItemsPayload);
  recordTest(
    "Reject Empty Items List",
    !parsedEmptyItems.success,
    "Strictly rejected borrow request without any requested hardware items."
  );

  // 6. Reject zero quantity
  const zeroQuantityItem = borrowRequestItemSchema.safeParse({
    itemId: "item-uuid-1",
    quantity: 0,
  });
  recordTest(
    "Reject Zero Quantity",
    !zeroQuantityItem.success,
    "Strictly rejected zero quantity for request item."
  );

  // 7. Reject negative quantity
  const negativeQuantityItem = borrowRequestItemSchema.safeParse({
    itemId: "item-uuid-1",
    quantity: -3,
  });
  recordTest(
    "Reject Negative Quantity",
    !negativeQuantityItem.success,
    "Strictly rejected negative quantity for request item."
  );

  // 8. Reject fractional quantity
  const floatQuantityItem = borrowRequestItemSchema.safeParse({
    itemId: "item-uuid-1",
    quantity: 2.5,
  });
  recordTest(
    "Reject Fractional Quantity",
    !floatQuantityItem.success,
    "Strictly rejected fractional quantity for hardware component."
  );

  // 9. Reject duplicate item IDs in the same request
  const duplicateItemsPayload = {
    ...validPayload,
    items: [
      { itemId: "duplicate-id-1", quantity: 1 },
      { itemId: "duplicate-id-1", quantity: 3 }, // duplicate itemId
    ],
  };
  const parsedDuplicate = createBorrowRequestSchema.safeParse(duplicateItemsPayload);
  recordTest(
    "Reject Duplicate Item IDs in Single Request",
    !parsedDuplicate.success &&
      Boolean(parsedDuplicate.error.issues.some((i) => i.path.includes("items"))),
    "Strictly rejected request containing duplicate item IDs."
  );

  // 10. Borrow requests query validation & defaults
  const parsedQuery = borrowRequestsQuerySchema.safeParse({
    page: "2",
    limit: "15",
    status: "pending",
  });
  recordTest(
    "Query Parameters Coercion & Validation",
    parsedQuery.success &&
      parsedQuery.data.page === 2 &&
      parsedQuery.data.limit === 15 &&
      parsedQuery.data.status === "pending",
    "Successfully coerced string query parameters to validated numbers and enums."
  );

  // 11. Reject invalid status in query
  const parsedBadStatusQuery = borrowRequestsQuerySchema.safeParse({
    status: "unknown_status",
  });
  recordTest(
    "Reject Invalid Status Query",
    !parsedBadStatusQuery.success,
    "Strictly rejected unapproved status filter value."
  );

  const passedCount = reports.filter((r) => r.passed).length;
  console.log(
    `=== Validation Unit Tests Summary: ${passedCount}/${reports.length} passed ===\n`
  );

  if (passedCount !== reports.length) {
    throw new Error("One or more borrow request validation unit tests failed.");
  }
}

if (process.argv[1]?.endsWith("testBorrowValidation.ts")) {
  runBorrowValidationUnitTests();
}
