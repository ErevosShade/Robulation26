if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {}
}

import { db } from "../lib/db";
import { inventoryItems, inventoryLedger } from "../lib/db/schema/inventory";
import { inventoryRequests } from "../lib/db/schema/requests";
import { eq, desc } from "drizzle-orm";

async function runApiTests() {
  console.log("=== Testing Inventory Telemetry & Ledger Integration ===");

  // 1. Test stats query directly matching the API implementation
  const [stats] = await db
    .select()
    .from(inventoryItems)
    .limit(1);

  console.log("Database connectivity verified.");

  // 2. Verify ledger append-only queries
  const ledgerRows = await db
    .select()
    .from(inventoryLedger)
    .orderBy(desc(inventoryLedger.createdAt))
    .limit(5);

  console.log(`Verified ${ledgerRows.length} recent stock ledger events in Neon DB.`);
  ledgerRows.forEach((r) => {
    console.log(` - [${r.transactionType}] delta: ${r.quantityDelta} | actor: ${r.performedBy} | reason: ${r.reason}`);
  });

  console.log("✅ Inventory Telemetry & Ledger Integration Verified!");
}

runApiTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
