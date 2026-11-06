import { skuRegex } from "@/lib/inventory/validation";

/**
 * Maps category names to standard 3-4 character aerospace/mechatronics SKU prefixes.
 */
export function getCategorySkuPrefix(category: string): string {
  const cat = (category || "").trim().toLowerCase();

  if (cat.includes("pneumatic")) return "PNEU";
  if (cat.includes("stationery")) return "STAT";
  if (cat.includes("tool")) return "TOOL";
  if (cat.includes("fastener")) return "FAST";
  if (cat.includes("driver") || cat.includes("esc")) return "DRV";
  if (cat.includes("motor") || cat.includes("servo")) return "MTR";
  if (cat.includes("micro") || cat.includes("mcu") || cat.includes("arduino")) return "MCU";
  if (cat.includes("cable") || cat.includes("connector") || cat.includes("wire")) return "CONN";
  if (cat.includes("power") || cat.includes("battery") || cat.includes("supply")) return "PWR";
  if (cat.includes("sensor") || cat.includes("mpu") || cat.includes("telemetry")) return "SENS";
  if (cat.includes("display") || cat.includes("screen") || cat.includes("oled") || cat.includes("lcd")) return "DISP";
  if (cat.includes("electronic") || cat.includes("component")) return "ELEC";
  if (cat.includes("hardware") || cat.includes("mech")) return "MECH";

  return "ROBO";
}

/**
 * Derives a clean uppercase alphanumeric token from an equipment name.
 * Does NOT alter the equipment name itself.
 */
export function deriveNameCode(name: string): string {
  // Strip special symbols and select primary uppercase characters
  const clean = name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  if (clean.length >= 3) {
    return clean.slice(0, 6);
  }
  return (clean + "ITEM").slice(0, 6);
}

/**
 * Generates a unique, valid SKU adhering to `/^[A-Z0-9_-]{2,64}$/`.
 * Ensures intra-file and global uniqueness against existing database items.
 */
export function generateCompliantSku(
  name: string,
  category: string,
  lineNumber: number,
  usedSkus: Set<string>
): string {
  const prefix = getCategorySkuPrefix(category);
  const nameCode = deriveNameCode(name);
  const lineSuffix = String(lineNumber).padStart(3, "0");

  let candidate = `${prefix}-${nameCode}-${lineSuffix}`;

  // Ensure it fits regex
  if (!skuRegex.test(candidate)) {
    candidate = `ROBO-${nameCode}-${lineSuffix}`.replace(/[^A-Z0-9_-]/g, "");
  }

  // If already used in this run, append numeric discriminator
  let counter = 1;
  let finalSku = candidate;
  while (usedSkus.has(finalSku)) {
    finalSku = `${candidate}-D${counter}`;
    counter++;
  }

  usedSkus.add(finalSku);
  return finalSku;
}
