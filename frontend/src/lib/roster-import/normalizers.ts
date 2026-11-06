/**
 * Utility functions for sanitizing and normalizing CSV string inputs.
 */

export function normalizeEmail(rawEmail: string | undefined | null): string {
  if (!rawEmail) return "";
  return rawEmail.trim().toLowerCase();
}

export function normalizeName(rawName: string | undefined | null): string {
  if (!rawName) return "";
  return rawName.trim().replace(/\s+/g, " ");
}

export function normalizeRole(rawRole: string | undefined | null): string {
  if (!rawRole) return "";
  return rawRole.trim().toLowerCase();
}

export function normalizeActive(rawActive: string | undefined | null): string {
  if (!rawActive) return "";
  return rawActive.trim().toLowerCase();
}
