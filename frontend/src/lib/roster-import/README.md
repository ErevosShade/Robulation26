# Member Roster CSV Import Architecture & Specifications

## Overview
The Member Roster CSV Import feature allows authorized administrators (`role: admin`) to bulk-preload approved members into the `member_roster` table in Neon PostgreSQL.

## Security & Authorization Model
- **Role Requirement**: Strictly requires `admin` role via `requireInventoryRole(["admin"])`.
- **Server-Side Enforcement**: All authentication and authorization checks occur server-side against live Better Auth sessions and `member_roster` records.
- **Fail-Closed**: Unauthenticated requests return 401; non-admin members return 403.
- **Client Role Tampering**: Client-provided roles, user IDs, or emails are ignored.
- **Default Import Mode**: Add-only. Existing records (including the primary administrator `hamzabitmesra786@gmail.com`) are never overwritten, deactivated, or demoted.

## CSV Schema (RFC-4180)
Expected header columns:
```csv
name,email,role,active
```

### Validation Rules
1. **Name**: Optional display name, trimmed.
2. **Email**: Required, trimmed, converted to lowercase, validated via standard email regex.
3. **Role**: Must be one of `admin`, `member`. Any other string (including legacy `intern`) is strictly rejected.
4. **Active**: Strictly `'true'` or `'false'`. Any other representation is rejected.
5. **Intra-file Duplicates**: Detected and flagged with the specific line numbers where duplicate emails appear.
6. **Existing Database Records**: Checked against `member_roster` in Neon; flagged as existing and skipped during import.

## Safe Import & Idempotency
- Uses parameterized Drizzle inserts with `onConflictDoNothing({ target: memberRoster.email })`.
- Repeated imports with the same CSV are idempotent: newly added records remain, existing records are safely skipped with 0 changes.
- Limits: Maximum file size 2MB, maximum 1000 rows per import.
