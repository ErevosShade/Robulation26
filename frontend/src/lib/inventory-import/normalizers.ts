/**
 * Normalizers and parsers for inventory spreadsheet values.
 */

export interface ParsedQuantityResult {
  quantity: number;
  unit: string;
  hasNonStandardUnit: boolean;
  rawString: string;
  warning?: string;
  error?: string;
}

/**
 * Parses raw quantity cell strings/numbers from Excel or CSV.
 * Handles integer numbers, numeric strings, and strings with units (e.g. "2 packs", "1 box").
 * Preserves unit fidelity and flags non-piece units.
 */
export function parseQuantityAndUnit(raw: unknown): ParsedQuantityResult {
  if (raw === undefined || raw === null || String(raw).trim() === "") {
    return {
      quantity: 0,
      unit: "pieces",
      hasNonStandardUnit: false,
      rawString: "",
      error: "Quantity is missing or blank.",
    };
  }

  // If already a clean integer number from Excel
  if (typeof raw === "number") {
    if (!Number.isFinite(raw) || !Number.isInteger(raw) || raw < 0) {
      return {
        quantity: 0,
        unit: "pieces",
        hasNonStandardUnit: false,
        rawString: String(raw),
        error: `Quantity '${raw}' is not a valid non-negative integer.`,
      };
    }
    return {
      quantity: raw,
      unit: "pieces",
      hasNonStandardUnit: false,
      rawString: String(raw),
    };
  }

  const str = String(raw).trim();

  // If clean integer in string form
  if (/^\d+$/.test(str)) {
    const qty = parseInt(str, 10);
    return {
      quantity: qty,
      unit: "pieces",
      hasNonStandardUnit: false,
      rawString: str,
    };
  }

  // Check for number + unit (e.g. "2 packs", "1 box", "10 sets", "1 bundle", "1 packet")
  const match = str.match(/^(\d+)\s*([a-zA-Z\s_-]+)$/);
  if (match) {
    const qty = parseInt(match[1], 10);
    const unit = match[2].trim().toLowerCase();
    return {
      quantity: qty,
      unit,
      hasNonStandardUnit: true,
      rawString: str,
      warning: `Non-piece unit '${unit}' detected. Total count parsed as ${qty} ${unit}. Unit recorded in item notes.`,
    };
  }

  // Could not parse safely
  return {
    quantity: 0,
    unit: "pieces",
    hasNonStandardUnit: false,
    rawString: str,
    error: `Unrecognized quantity format '${str}'. Must be a whole number or count with unit description.`,
  };
}

/**
 * Discovers and maps column headers dynamically from a spreadsheet row.
 */
export function mapDiscoveredHeaders(headers: string[]): {
  nameCol: number;
  skuCol: number;
  categoryCol: number;
  quantityCol: number;
  notesCol: number;
  idCol: number;
  discovered: string[];
} {
  let nameCol = -1;
  let skuCol = -1;
  let categoryCol = -1;
  let quantityCol = -1;
  let notesCol = -1;
  let idCol = -1;

  const discovered = headers.map((h) => String(h || "").trim());

  discovered.forEach((header, idx) => {
    const lower = header.toLowerCase();
    if (lower === "name" || lower === "item name" || lower === "equipment name" || lower === "item") {
      if (nameCol === -1) nameCol = idx;
    } else if (lower === "sku" || lower === "item sku" || lower === "product code") {
      if (skuCol === -1) skuCol = idx;
    } else if (lower === "category" || lower === "type" || lower === "item category") {
      if (categoryCol === -1) categoryCol = idx;
    } else if (
      lower === "total quantity" ||
      lower === "total_quantity" ||
      lower === "quantity" ||
      lower === "qty" ||
      lower === "total qty" ||
      lower === "stock"
    ) {
      if (quantityCol === -1) quantityCol = idx;
    } else if (lower === "notes" || lower === "note" || lower === "comments" || lower === "remarks") {
      if (notesCol === -1) notesCol = idx;
    } else if (lower === "id" || lower === "item_id" || lower === "identifier") {
      if (idCol === -1) idCol = idx;
    }
  });

  return {
    nameCol,
    skuCol,
    categoryCol,
    quantityCol,
    notesCol,
    idCol,
    discovered,
  };
}

/**
 * Sanitizes equipment name while strictly preserving original characters,
 * symbols, and case without renaming.
 */
export function preserveEquipmentName(raw: unknown): string {
  if (raw === undefined || raw === null) return "";
  // Trim outer whitespace only; preserve all interior spacing, case, and punctuation
  return String(raw).trim();
}

/**
 * Sanitizes text to prevent CSV formula injection (DDE attacks)
 * when exporting spreadsheet reports.
 */
export function sanitizeCsvCell(value: unknown): string {
  if (value === undefined || value === null) return "";
  const str = String(value);
  // If the cell begins with dangerous formula triggers (=, +, -, @, tab, CR), prepend a single quote
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}
