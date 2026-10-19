import {
  ALLOWED_ROSTER_ROLES,
  type RosterValidationError,
} from "./types";
import { normalizeEmail, normalizeRole, normalizeActive } from "./normalizers";
import type { InventoryRole } from "@/lib/auth";

// RFC 5322 compliant practical email regex
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export interface FieldValidationResult<T> {
  isValid: boolean;
  value?: T;
  error?: string;
}

export function validateEmailField(rawEmail: string | undefined | null): FieldValidationResult<string> {
  const normalized = normalizeEmail(rawEmail);
  if (!normalized) {
    return { isValid: false, error: "Email address is required and cannot be empty." };
  }
  if (!EMAIL_REGEX.test(normalized)) {
    return {
      isValid: false,
      error: `Invalid email address format: "${rawEmail}".`,
    };
  }
  if (normalized.length > 255) {
    return {
      isValid: false,
      error: "Email address exceeds maximum length of 255 characters.",
    };
  }
  return { isValid: true, value: normalized };
}

export function validateRoleField(rawRole: string | undefined | null): FieldValidationResult<InventoryRole> {
  const normalized = normalizeRole(rawRole);
  // Default to "member" if omitted or blank
  if (!normalized) {
    return { isValid: true, value: "member" };
  }
  if (!(ALLOWED_ROSTER_ROLES as readonly string[]).includes(normalized)) {
    return {
      isValid: false,
      error: `Invalid role "${rawRole}". Allowed roles are: ${ALLOWED_ROSTER_ROLES.join(", ")}.`,
    };
  }
  return { isValid: true, value: normalized as InventoryRole };
}

export function validateActiveField(rawActive: string | undefined | null): FieldValidationResult<boolean> {
  const normalized = normalizeActive(rawActive);
  // Default to true if omitted or blank
  if (!normalized) {
    return { isValid: true, value: true };
  }
  if (normalized === "true") {
    return { isValid: true, value: true };
  }
  if (normalized === "false") {
    return { isValid: true, value: false };
  }
  return {
    isValid: false,
    error: `Invalid active value "${rawActive}". Must be strictly "true" or "false".`,
  };
}

export function validateHeaders(headers: string[] | undefined): { isValid: boolean; error?: string } {
  if (!headers || headers.length === 0) {
    return { isValid: false, error: "CSV file contains no header row." };
  }

  const normalizedHeaders = headers.map((h) => h.trim().toLowerCase());

  // Email is the strictly required column; name, role, active are standard
  if (!normalizedHeaders.includes("email")) {
    return {
      isValid: false,
      error: `Missing required "email" column in CSV header. Found: [${headers.join(", ")}]. Expected columns: [name, email, role, active].`,
    };
  }

  return { isValid: true };
}
