import {
  collectRequestSchema,
  returnItemSchema,
  returnRequestSchema,
} from "../lib/inventory/validation";
import {
  formatBorrowRequestCollectionNotification,
  formatBorrowRequestReturnNotification,
} from "../lib/telegram/service";
import type {
  TelegramBorrowRequestCollectionPayload,
  TelegramBorrowRequestReturnPayload,
} from "../lib/telegram/types";

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

export function runBorrowCollectionReturnUnitTests() {
  console.log("=== Starting Collection & Return Unit Tests ===");

  // --- 1. collectRequestSchema Tests ---

  // 1.1 Accept empty body
  const emptyCollect = collectRequestSchema.safeParse({});
  recordTest(
    "Collect Schema - Accept Empty Body",
    emptyCollect.success && emptyCollect.data.notes === undefined,
    "Empty collection request body successfully parses."
  );

  // 1.2 Accept valid notes
  const validCollect = collectRequestSchema.safeParse({
    notes: "Retrieved from Bay 4 by cadet",
  });
  recordTest(
    "Collect Schema - Accept Valid Notes",
    validCollect.success && validCollect.data.notes === "Retrieved from Bay 4 by cadet",
    "Preserved valid collection notes."
  );

  // 1.3 Reject exceeding 1000 chars
  const tooLongCollect = collectRequestSchema.safeParse({
    notes: "A".repeat(1001),
  });
  recordTest(
    "Collect Schema - Reject Exceeding 1000 Chars",
    !tooLongCollect.success,
    "Rejected collection notes exceeding max length."
  );

  // --- 2. returnRequestSchema Tests ---

  // 2.1 Accept valid return with good condition
  const validGoodReturn = returnRequestSchema.safeParse({
    notes: "Normal project return",
    items: [
      {
        itemId: "item-uuid-1",
        quantity: 2,
        condition: "good",
        notes: "All pins intact",
      },
    ],
  });
  recordTest(
    "Return Schema - Valid Good Condition Item",
    validGoodReturn.success,
    "Accepted return payload with good condition."
  );

  // 2.2 Accept valid return with damaged condition
  const validDamagedReturn = returnRequestSchema.safeParse({
    items: [
      {
        itemId: "item-uuid-2",
        quantity: 1,
        condition: "damaged",
        notes: "Burned resistor on 5V rail",
      },
    ],
  });
  recordTest(
    "Return Schema - Valid Damaged Condition Item",
    validDamagedReturn.success,
    "Accepted return payload with damaged condition and incident notes."
  );

  // 2.3 Reject empty items array
  const emptyItemsReturn = returnRequestSchema.safeParse({ items: [] });
  recordTest(
    "Return Schema - Reject Empty Items Array",
    !emptyItemsReturn.success,
    "Rejected return without any items."
  );

  // 2.4 Reject zero quantity
  const zeroQtyReturn = returnRequestSchema.safeParse({
    items: [{ itemId: "item-uuid-1", quantity: 0, condition: "good" }],
  });
  recordTest(
    "Return Schema - Reject Zero Quantity",
    !zeroQtyReturn.success,
    "Rejected return item with quantity 0."
  );

  // 2.5 Reject negative quantity
  const negQtyReturn = returnRequestSchema.safeParse({
    items: [{ itemId: "item-uuid-1", quantity: -2, condition: "good" }],
  });
  recordTest(
    "Return Schema - Reject Negative Quantity",
    !negQtyReturn.success,
    "Rejected return item with negative quantity."
  );

  // 2.6 Reject fractional quantity
  const fracQtyReturn = returnRequestSchema.safeParse({
    items: [{ itemId: "item-uuid-1", quantity: 1.5, condition: "good" }],
  });
  recordTest(
    "Return Schema - Reject Fractional Quantity",
    !fracQtyReturn.success,
    "Rejected return item with fractional quantity."
  );

  // 2.7 Reject invalid condition
  const invalidConditionReturn = returnRequestSchema.safeParse({
    items: [{ itemId: "item-uuid-1", quantity: 1, condition: "broken" as any }],
  });
  recordTest(
    "Return Schema - Reject Invalid Condition Enum",
    !invalidConditionReturn.success,
    "Rejected invalid condition string (must be 'good' or 'damaged')."
  );

  // --- 3. Telegram Collection Formatter Tests ---

  const collectionPayload: TelegramBorrowRequestCollectionPayload = {
    requestId: "req-col-001",
    requesterName: "Dr. Evelyn Reed <Lead>",
    requesterEmail: "evelyn@robolution.space",
    collectorName: "Cadet Liam <Pilot>",
    collectorEmail: "liam@robolution.space",
    project: "Sub-orbital Drone Array <Mk II>",
    items: [
      { name: "STM32F401 Dev Board", sku: "MCU-STM32-02", quantity: 2 },
      { name: "LiDAR Puck v1", sku: "SENS-LIDAR-01", quantity: 1 },
    ],
    notes: "Collected from Bay 2 by Liam",
    collectedAt: new Date("2026-10-24T14:00:00Z"),
  };

  const formattedCollection = formatBorrowRequestCollectionNotification(collectionPayload);

  recordTest(
    "Telegram Formatter - Collection Header & Details",
    formattedCollection.includes("HARDWARE COLLECTED BY MEMBER") &&
      formattedCollection.includes("COLLECTED / CHECKED OUT") &&
      formattedCollection.includes("req-col-001") &&
      formattedCollection.includes("Cadet Liam &lt;Pilot&gt;") &&
      formattedCollection.includes("Dr. Evelyn Reed &lt;Lead&gt;"),
    "Formatted collection alert with escaped HTML and collector details."
  );

  recordTest(
    "Telegram Formatter - Collection Items & Ledger Note",
    formattedCollection.includes("STM32F401 Dev Board") &&
      formattedCollection.includes("MCU-STM32-02") &&
      formattedCollection.includes("2 unit(s)") &&
      formattedCollection.includes("Stock moved from reserved to checked-out balance"),
    "Formatted item breakdown and stock movement note."
  );

  // --- 4. Telegram Return Formatter Tests ---

  const returnPayload: TelegramBorrowRequestReturnPayload = {
    requestId: "req-ret-002",
    requesterName: "Alex Vance",
    requesterEmail: "alex@robolution.space",
    returnerName: "Alex Vance",
    returnerEmail: "alex@robolution.space",
    project: "Rover Obstacle Navigation <High Speed>",
    status: "partially_returned",
    items: [
      {
        name: "STM32F401 Dev Board",
        sku: "MCU-STM32-02",
        quantity: 1,
        condition: "good",
        notes: "Fully functional",
      },
      {
        name: "LiDAR Puck v1",
        sku: "SENS-LIDAR-01",
        quantity: 1,
        condition: "damaged",
        notes: "Fractured optical lens casing",
      },
    ],
    notes: "Batch 1 return after testing",
    returnedAt: new Date("2026-10-24T15:30:00Z"),
  };

  const formattedReturn = formatBorrowRequestReturnNotification(returnPayload);

  recordTest(
    "Telegram Formatter - Return Header & Status Badge",
    formattedReturn.includes("HARDWARE RETURNED &amp; INSPECTED") &&
      formattedReturn.includes("PARTIALLY RETURNED") &&
      formattedReturn.includes("req-ret-002") &&
      formattedReturn.includes("&lt;High Speed&gt;"),
    "Formatted return alert with status badge and escaped HTML."
  );

  recordTest(
    "Telegram Formatter - Return Item Condition Badges",
    formattedReturn.includes("GOOD") &&
      formattedReturn.includes("DAMAGED") &&
      formattedReturn.includes("Fractured optical lens casing"),
    "Formatted good and damaged item condition badges with incident notes."
  );

  console.log("=== Collection & Return Unit Tests Finished ===");
  const allPassed = reports.every((r) => r.passed);
  if (!allPassed) {
    throw new Error("One or more collection/return unit tests failed.");
  }
}

// Allow direct CLI execution
if (require.main === module || process.argv[1]?.endsWith("testBorrowCollectionReturnUnit.ts")) {
  try {
    runBorrowCollectionReturnUnitTests();
    console.log("All collection & return unit tests passed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Test runner failed:", err);
    process.exit(1);
  }
}
