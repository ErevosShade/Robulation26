if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

process.env.TELEGRAM_MOCK_MODE = "true";

import { eq } from "drizzle-orm";
import { db } from "../lib/db";
import { inventoryItems, inventoryLedger } from "../lib/db/schema/inventory";
import {
  inventoryRequests,
  inventoryRequestItems,
} from "../lib/db/schema/requests";
import { inventoryNotificationOutbox } from "../lib/db/schema/outbox";
import { createInventoryItem } from "../lib/inventory/service";
import {
  createBorrowRequest,
  listBorrowRequests,
  getBorrowRequestById,
} from "../lib/inventory/requests";
import { InventoryError } from "../lib/inventory/errors";

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

export async function runBorrowListingAuthTests() {
  console.log("=== Starting Borrow Request Listing & Role Isolation Suite ===");

  const timestamp = Date.now();
  const testSku = `TEST-LIST-SKU-${timestamp}`;
  let itemId = "";
  let requestAId = "";
  let requestBId = "";

  const memberA = {
    id: `member-a-${timestamp}`,
    name: "Alice Engineer",
    email: `alice.${timestamp}@robolution.space`,
    role: "member",
  };

  const memberB = {
    id: `member-b-${timestamp}`,
    name: "Bob Mechatronics",
    email: `bob.${timestamp}@robolution.space`,
    role: "member",
  };

  const adminUser = {
    id: `admin-${timestamp}`,
    name: "Chief Mechatronics Officer",
    email: `admin.${timestamp}@robolution.space`,
    role: "admin",
  };

  try {
    // 1. Create a shared test hardware item
    const item = await createInventoryItem(
      {
        name: `Telemetry Radio Transceiver ${timestamp}`,
        sku: testSku,
        category: "Comms",
        totalQuantity: 20,
        minimumStock: 2,
      },
      adminUser.email
    );
    itemId = item.id;

    // 2. Member A creates Request A
    const reqA = await createBorrowRequest(memberA, {
      project: "Alice Rover Subsystem Comm Link",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 4),
      items: [{ itemId, quantity: 2 }],
    });
    requestAId = reqA.request.id;

    // 3. Member B creates Request B
    const reqB = await createBorrowRequest(memberB, {
      project: "Bob Quadruped Telemetry Mast",
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000 * 5),
      items: [{ itemId, quantity: 3 }],
    });
    requestBId = reqB.request.id;

    // 4. Member A lists requests - must see ONLY Request A, NEVER Request B
    const memberAList = await listBorrowRequests(memberA, {});
    const memberASeesA = memberAList.items.some((r) => r.id === requestAId);
    const memberASeesB = memberAList.items.some((r) => r.id === requestBId);

    recordTest(
      "Member Isolation - List Filtering",
      memberASeesA && !memberASeesB,
      "Member A lists requests and sees only their own request; Member B's request is strictly hidden."
    );

    // 5. Parameter Tampering Prevention: Member B tries passing userId = memberA.id
    const tamperedList = await listBorrowRequests(memberB, {
      userId: memberA.id,
    });
    const tamperedSeesA = tamperedList.items.some((r) => r.id === requestAId);
    const tamperedSeesB = tamperedList.items.some((r) => r.id === requestBId);

    recordTest(
      "Query Parameter Tampering Prevention",
      !tamperedSeesA && tamperedSeesB,
      "Service ignored client-supplied userId for member caller; query remained strictly locked to member's session."
    );

    // 6. Direct Request Access Isolation: Member B tries inspecting Request A by ID
    let crossMemberAccessBlocked = false;
    try {
      await getBorrowRequestById(memberB, requestAId);
    } catch (err) {
      if (err instanceof InventoryError && err.code === "FORBIDDEN_REQUEST_ACCESS") {
        crossMemberAccessBlocked = true;
      }
    }

    recordTest(
      "Direct Inspection Isolation",
      crossMemberAccessBlocked,
      "Member B attempting to view Member A's request ID is strictly denied with FORBIDDEN_REQUEST_ACCESS (403)."
    );

    // 7. Admin Visibility: Admin sees requests across all members
    const adminList = await listBorrowRequests(adminUser, {});
    const adminSeesA = adminList.items.some((r) => r.id === requestAId);
    const adminSeesB = adminList.items.some((r) => r.id === requestBId);

    recordTest(
      "Admin Universal Listing",
      adminSeesA && adminSeesB,
      "Admin caller successfully retrieves requests across all members."
    );

    // 8. Admin Filtering: Admin filters by specific member ID
    const adminFilteredByA = await listBorrowRequests(adminUser, {
      userId: memberA.id,
    });
    const filteredOnlyHasA =
      adminFilteredByA.items.every((r) => r.userId === memberA.id) &&
      adminFilteredByA.items.some((r) => r.id === requestAId);

    recordTest(
      "Admin Targeted Member Filter",
      filteredOnlyHasA,
      "Admin successfully filtered requests to specific member ID."
    );

    // 9. Admin Direct Inspection: Admin can inspect any request by ID
    const adminInspectedA = await getBorrowRequestById(adminUser, requestAId);
    recordTest(
      "Admin Direct Request Inspection",
      Boolean(adminInspectedA && adminInspectedA.id === requestAId),
      "Admin successfully inspected Member A's request details and items."
    );
  } finally {
    // Cleanup test records
    try {
      if (requestAId) {
        await db.delete(inventoryRequests).where(eq(inventoryRequests.id, requestAId));
        await db
          .delete(inventoryNotificationOutbox)
          .where(eq(inventoryNotificationOutbox.referenceId, requestAId));
      }
      if (requestBId) {
        await db.delete(inventoryRequests).where(eq(inventoryRequests.id, requestBId));
        await db
          .delete(inventoryNotificationOutbox)
          .where(eq(inventoryNotificationOutbox.referenceId, requestBId));
      }
      if (itemId) {
        await db.delete(inventoryLedger).where(eq(inventoryLedger.itemId, itemId));
        await db.delete(inventoryItems).where(eq(inventoryItems.id, itemId));
      }
    } catch {}
  }

  const passedCount = reports.filter((r) => r.passed).length;
  console.log(
    `=== Listing & Auth Suite Summary: ${passedCount}/${reports.length} passed ===\n`
  );

  if (passedCount !== reports.length) {
    throw new Error("One or more listing/auth tests failed.");
  }
}

if (process.argv[1]?.endsWith("testBorrowListingAuth.ts")) {
  runBorrowListingAuthTests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Listing/Auth test runner failed:", err);
      process.exit(1);
    });
}
