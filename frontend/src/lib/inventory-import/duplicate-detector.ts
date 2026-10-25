export interface DuplicateDetectionResult {
  isDuplicateCandidate: boolean;
  duplicateCandidateLines: number[];
  warningMessage?: string;
}

/**
 * Normalizes an equipment name for fuzzy similarity comparison
 * without altering the underlying equipment name.
 */
export function normalizeNameForComparison(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Builds a duplicate name index across raw spreadsheet rows.
 * Detects identical or highly similar names appearing on multiple lines.
 */
export function buildDuplicateNameIndex(
  rows: Array<{ line: number; name: string }>
): Map<string, number[]> {
  const index = new Map<string, number[]>();

  for (const row of rows) {
    const key = normalizeNameForComparison(row.name);
    if (!key) continue;

    const existing = index.get(key) || [];
    existing.push(row.line);
    index.set(key, existing);
  }

  return index;
}

/**
 * Evaluates whether a row's name is a duplicate candidate across other rows in the file.
 * Returns candidate line numbers and an informative warning message.
 */
export function checkDuplicateCandidate(
  name: string,
  currentLine: number,
  duplicateIndex: Map<string, number[]>
): DuplicateDetectionResult {
  const key = normalizeNameForComparison(name);
  const matchingLines = (duplicateIndex.get(key) || []).filter(
    (line) => line !== currentLine
  );

  if (matchingLines.length > 0) {
    return {
      isDuplicateCandidate: true,
      duplicateCandidateLines: matchingLines,
      warningMessage: `Similar or identical equipment name appears on line(s) ${matchingLines.join(
        ", "
      )}. Treated as a distinct item with a distinct SKU. Please review if this represents separate stock allocations.`,
    };
  }

  return {
    isDuplicateCandidate: false,
    duplicateCandidateLines: [],
  };
}
