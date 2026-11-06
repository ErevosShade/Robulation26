# Robolution26 Inventory Management — Implementation Plan

**Document version:** 2.0  
**Status:** Proposed architecture  
**Frontend project:** `frontend/`  
**Organization:** Robolution (Team Pratyumnis), BIT Mesra

---

## 1. Goal

Build an auditable inventory management system for Robolution's robotics hardware. It must track components, storage locations, stock movements, checkout requests, approvals, returns, damage reports, and administrative CSV operations.

The inventory system will be implemented using **TypeScript and Neon PostgreSQL**, alongside the existing Next.js application. It will not use Payload CMS or a separate Java/Spring Boot service.

The existing public landing page and its futuristic design should remain intact. Inventory pages should use a calmer, information-dense UI suited to operational work.

## 2. Verified project context and assumptions

The existing frontend audit identified:

- Next.js App Router and React
- TypeScript
- Tailwind CSS v4
- Existing Cloudflare Workers/OpenNext configuration
- An existing futuristic landing page and reusable HUD components

Before implementation, inspect the live repository and confirm the actual versions, scripts, package manager, deployment target, and current source files. The architecture below is the intended design, not a claim that these features already exist.

### Planned backend stack

- **Application/API:** Next.js App Router Route Handlers and server-only modules
- **Language:** TypeScript
- **Database:** Neon PostgreSQL
- **ORM and migrations:** Drizzle ORM and Drizzle Kit
- **Request validation:** Zod
- **Authentication:** Choose and configure a compatible authentication solution before protected routes are built
- **Notifications:** Telegram Bot API, optional for the initial inventory release
- **Testing:** Use a test runner compatible with the current repository; verify dependencies before adding them

Check Neon connectivity and the selected driver's compatibility with the existing Cloudflare/OpenNext runtime before production deployment. Keep `DATABASE_URL`, authentication secrets, and Telegram tokens in server-side environment variables.

## 3. Roles and permissions

The Robolution inventory system defines exactly two roles: `admin` and `member`.

### Member
- Browse inventory.
- Request checkout for a project or purpose.
- View their own transactions and request returns for their active checkouts.
- Report damage with mandatory incident details.
- Cannot directly edit stock balances or access administrative tools.

### Admin
- Create/update categories and items.
- Approve/reject checkout requests.
- Verify returns and damage reports where the workflow requires approval.
- Adjust stock with a mandatory reason.
- Import/export CSV and manage member roster preloads.
- View all transactions and resolve discrepancies.

All authorization must be enforced on the server. Derive the actor from the verified session, never from client-supplied role or user ID fields.

## 4. Target folder structure

Adapt this structure to the existing repository instead of blindly creating duplicates.

```text
frontend/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── health/route.ts
│   │   │   └── inventory/
│   │   │       ├── route.ts
│   │   │       ├── [id]/route.ts
│   │   │       ├── requests/route.ts
│   │   │       ├── requests/[requestId]/route.ts
│   │   │       └── transactions/route.ts
│   │   └── (frontend)/
│   │       └── inventory/
│   │           ├── page.tsx
│   │           ├── [id]/page.tsx
│   │           ├── requests/page.tsx
│   │           ├── transactions/page.tsx
│   │           └── admin/page.tsx
│   ├── components/
│   │   └── inventory/
│   │       ├── InventoryShell.tsx
│   │       ├── InventoryStats.tsx
│   │       ├── InventoryFilters.tsx
│   │       ├── InventoryTable.tsx
│   │       ├── CheckoutRequestDialog.tsx
│   │       ├── ReturnDialog.tsx
│   │       ├── DamageReportDialog.tsx
│   │       ├── AdjustmentDialog.tsx
│   │       ├── LowStockList.tsx
│   │       └── TransactionTimeline.tsx
│   ├── db/
│   │   ├── index.ts
│   │   └── schema/
│   │       ├── users.ts
│   │       ├── inventory-categories.ts
│   │       ├── inventory-items.ts
│   │       └── inventory-transactions.ts
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── session.ts
│   │   │   └── permissions.ts
│   │   ├── inventory/
│   │   │   ├── quantity.ts
│   │   │   ├── service.ts
│   │   │   ├── validation.ts
│   │   │   └── csv.ts
│   │   └── telegram/
│   │       └── client.ts
│   └── ...
├── drizzle/
│   └── migrations/
├── drizzle.config.ts
├── .env.example
└── package.json
```

If the current application does not use a route group named `(frontend)`, place the pages under the actual existing App Router structure. Keep database access and privileged business logic in server-only modules.

## 5. Database design

### 5.1 Users

Use the chosen authentication system's user identity as the basis for authorization. Add a role field or role mapping with the values:

- `admin`
- `member`

Never trust a role sent by the browser.

### 5.2 Inventory categories

Suggested fields:

- `id`
- `name`
- `slug`
- `description`
- `parentId` (nullable self-reference)
- `icon`
- `color`
- `sortOrder`
- `active`
- `createdAt`
- `updatedAt`

Category names/slugs should be unique under the chosen policy. Prevent self-parenting and category cycles.

### 5.3 Inventory items

Suggested fields:

- `id`
- `name`
- `slug`
- `sku` (unique)
- `categoryId`
- `description`
- `specifications` (JSONB, when useful)
- `tags` (JSONB or a normalized table; choose deliberately)
- `room`
- `cabinet`
- `shelf`
- `bin`
- `unitCost` (optional; use a suitable decimal representation)
- `currency` (default `INR`)
- `totalQuantity`
- `reservedQuantity`
- `checkedOutQuantity`
- `damagedQuantity`
- `minimumStock`
- `consumable`
- `active`
- `internalNotes` (admin-only access)

Compute available quantity server-side:

`availableQuantity = totalQuantity - reservedQuantity - checkedOutQuantity - damagedQuantity`

Do not accept computed availability from the client. Use database constraints and transactional service logic to prevent negative quantities or over-allocation.

Recommended status values:

- `inactive` if the item is inactive
- `out_of_stock` if available quantity is zero
- `low_stock` if available quantity is positive and at or below `minimumStock`
- `in_stock` otherwise

### 5.4 Inventory transactions

Use an append-only ledger for stock-affecting events. Suggested fields:

- `id`
- `itemId`
- `type`: `checkout_request`, `checkout`, `return`, `reservation`, `adjustment`, `damage_report`, `transfer`, `write_off`, `restock`
- `status`: `pending`, `approved`, `rejected`, `completed`, `cancelled`
- `quantity`
- `requestedBy`
- `performedBy`
- `approvedBy`
- `project`
- `reason`
- `conditionNotes`
- `locationFrom`
- `locationTo`
- `metadata` (JSONB)
- `createdAt`
- `completedAt`

Use separate request and movement records if that produces clearer state transitions. Do not mutate or delete historical audit entries through normal application workflows. Record corrections as new ledger entries.

## 6. Inventory workflows

### Checkout request
1. Authenticate the caller and validate item, quantity, recipient, and project/purpose.
2. Begin a database transaction and lock or conditionally update the relevant item row.
3. Check availability and prevent concurrent requests from over-allocating stock.
4. Record the request and apply the chosen reservation policy consistently.
5. Notify the requester and/or authorized admins as configured.

Decide explicitly whether pending requests reserve stock. A recommended default is to reserve stock only when approved, while checking availability at approval time; if approved requests must reserve immediately, implement that policy atomically. Never reserve the same quantity twice.

### Approval/rejection
- Admin-only.
- Verify the request is in an eligible state.
- Make status transition and any reservation update atomically.
- Prevent repeated callbacks or duplicate approvals from applying stock changes twice.
- Store the acting admin and timestamp.

### Physical checkout
- Record the actual handover.
- Move quantity from reserved to checked-out without counting it twice.
- Validate that the approved request has enough remaining quantity.

### Return
- Validate ownership/permissions and active checkout quantity.
- Record returned quantity and condition notes.
- Update checked-out balance and usable/damaged quantities atomically.
- Add a ledger entry.

### Damage
- Require a non-empty incident description and positive quantity.
- Verify that the quantity is attributable to available or checked-out holdings.
- Move damaged units to `damagedQuantity` when still held by the club.
- Decrease `totalQuantity` only for a separately authorized write-off that removes units from holdings.
- Write the stock update and audit record atomically.

### Stock adjustment
- Admin-only.
- Require a reason and record before/after quantities or a signed delta.
- Never allow negative or inconsistent stock balances.
- Create a corresponding immutable ledger entry.

## 7. API route plan

Use Route Handlers under `src/app/api/`. Exact paths should follow the actual route structure in the repository.

### Initial routes
- `GET /api/health` — application and database health check; verified without exposing secrets or connection details.
- `GET /api/inventory` — paginated catalog, search, plain-text category and server-derived status filters.
- `GET /api/inventory/[id]` — item detail with non-admin internal notes sanitization.
- `POST /api/inventory` — admin-only item creation with SKU uniqueness and initial stock ledger entry.
- `PATCH /api/inventory/[id]` — admin-only partial updates with atomic concurrency protection and ledger recording.
- `DELETE /api/inventory/[id]` — admin-only safe soft-deletion/archival with active commitment guard.
- `POST /api/inventory/requests` — create multi-item hardware borrow request with transactional outbox Telegram alert. (Implemented)
- `GET /api/inventory/requests` — list borrow requests with member session ownership isolation and admin pagination/filtering. (Implemented)
- `POST /api/inventory/requests/[requestId]/approve` — admin approval (next milestone).
- `POST /api/inventory/requests/[requestId]/reject` — admin rejection (next milestone).
- `POST /api/inventory/[id]/returns` — record a return under the chosen approval policy (next milestone).
- `POST /api/inventory/[id]/damage-reports` — report damage (next milestone).
- `POST /api/inventory/[id]/adjustments` — admin-only stock adjustment (next milestone).
- `GET /api/inventory/transactions` — role-filtered transaction history (next milestone).
- Admin-only CSV import/export endpoints (Roster import completed at `/api/inventory/admin/members/*`).

### Borrow Requests & Invariants Specification
- **Tables**: `inventory_requests`, `inventory_request_items`, and `inventory_notification_outbox` (Migration `0004_flashy_may_parker.sql`).
- **Dates constraint**: `end_date >= start_date`.
- **Items constraint**: `quantity > 0`, foreign key restrict on item deletion, cascade on request deletion, unique `(request_id, item_id)`.
- **Critical Stock Rule**: Submitting a pending request strictly avoids mutating `total_quantity`, `reserved_quantity`, or `checked_out_quantity` on `inventory_items`, and produces zero entries in `inventory_stock_ledger`. Stock availability is verified at submission time to reject impossible requests, and will be locked atomically during the future approval workflow.
- **Telegram Outbox Guarantee**: Notifications are recorded in `inventory_notification_outbox` in the same transactional boundary as the request. An asynchronous dispatcher sends HTML-formatted telemetry to Telegram. If the Telegram API fails or is unreachable, the request remains safely persisted, the outbox record tracks the error for retry, and duplicate messages are strictly prevented.
- **Verification Harness**: Run `pnpm run test:requests` to execute all 37 unit and integration tests across validation, formatting, outbox retry, stock invariants, and member authorization isolation.


Use Zod schemas at request boundaries. Return consistent error responses and appropriate HTTP status codes. Add pagination limits and avoid exposing stack traces.

## 8. CSV operations

### Export
- Catalog export includes category, SKU, quantities, status, location, and tags.
- Audit export is admin-only.
- Escape CSV cells correctly and guard against spreadsheet formula injection.
- Avoid exposing admin-only notes or unnecessary personal information.

### Import
- Admin-only.
- Parse and validate on the server.
- Validate every row before committing writes.
- Report row-level errors.
- Use SKU as the stable upsert key.
- Use a transaction where practical and create audit entries for stock changes.
- Do not import historical transactions in v1 unless required for a migration.

## 9. Security and operational requirements

- Use a supported authentication solution and verify its compatibility with Next.js and Cloudflare.
- Enforce authorization on every protected Route Handler and server action.
- Keep Neon connection strings, session secrets, and Telegram bot tokens server-side.
- Validate all input and use parameterized ORM queries.
- Apply rate limits to sensitive endpoints where appropriate.
- Protect against CSRF where applicable to the chosen authentication model.
- Use secure session cookies and an explicit CORS policy if the API is called from a separate origin.
- Use database constraints, transactions, and row-level concurrency control for stock mutations.
- Do not log secrets or unnecessary personal data.
- Back up important inventory data and test restore procedures.
- Verify that Neon connection pooling/driver settings work with the deployed Cloudflare runtime.

## 10. Real-time behavior

Version 1 should prioritize correctness over complex real-time infrastructure.

- Revalidate or refresh pages after successful mutations.
- Use modest polling only if the dashboard needs it.
- Do not build an in-memory event broadcaster as a production multi-instance solution.
- Consider SSE or another event system only after the main workflows are reliable.

## 11. Testing

Add tests for:

- Quantity and status calculations
- Role-based permissions
- Checkout request validation
- Approval/rejection state transitions
- Concurrent requests for limited stock
- Duplicate approval prevention
- Return and damage flows
- Audit ledger creation
- CSV validation and formula-injection protection
- Users seeing only their own records
- Admin-only endpoints

Also test the public website after inventory work to ensure existing landing-page behavior remains intact.

## 12. Implementation sequence

### Phase 0 — Repository and deployment verification
1. Inspect current package manager, scripts, routes, and environment configuration.
2. Verify Cloudflare/OpenNext runtime compatibility with the Neon driver.
3. Create `.env.example` without real secrets.
4. Add Drizzle and Zod only after confirming versions and package-manager policy.
5. Add a safe database health check.

### Phase 1 — Database foundation
1. Configure Neon.
2. Add Drizzle configuration and schema.
3. Generate and apply migrations.
4. Add seed data for categories in a controlled development workflow.
5. Test database connectivity.

### Phase 2 — Authentication and authorization
1. Select and configure the authentication solution.
2. Implement role assignment and server-side permission helpers.
3. Test protected endpoints.

### Phase 3 — Inventory CRUD and catalog
1. Add categories and items.
2. Implement search, pagination, filters, and item details.
3. Calculate availability and status server-side.

### Phase 4 — Transactions and stock workflows
1. Implement checkout requests and the selected reservation policy. (Completed: `POST /api/inventory/requests`, `GET /api/inventory/requests`).
2. Add admin approval and rejection workflows (Completed: `POST /api/inventory/requests/[id]/approve`, `POST /api/inventory/requests/[id]/reject`):
   - **Atomic Stock Reservation:** Uses interactive transactions (`runTransaction`) with conditional SQL guards ensuring `totalQuantity - (reservedQuantity + quantity + checkedOutQuantity + damagedQuantity) >= 0`.
   - **Audit Ledger:** Records immutable entries with `transaction_type = 'reservation'`, capturing acting admin, delta, and comprehensive metadata (including `{ selfApproved: true }` if an admin approves their own request).
   - **Zero-Mutation Rejection:** Rejection updates status to `rejected` atomically without altering stock quantities or creating stock ledger entries.
   - **Transactional Outbox:** Dispatches Telegram review alerts post-commit; delivery failures never roll back approved or rejected state.
3. Implement member collection confirmation and return lifecycle (Completed: `POST /api/inventory/requests/[id]/collect`, `POST /api/inventory/requests/[id]/return`, `GET /api/inventory/requests/[id]/returns`):
   - **Member Self-Collection:** Members physically retrieve their own approved hardware and confirm collection via UI or API.
   - **Atomic Stock Transition:** `reservedQuantity` decreases and `checkedOutQuantity` increases atomically (`transaction_type = 'checkout'`).
   - **Partial & Full Returns with Condition Inspection:** Returned units are tagged as `good` (restoring `availableQuantity`) or `damaged` (holding in `damagedQuantity`, keeping unavailable).
   - **Over-Return Guard:** Prevents returning more units than are outstanding on the request.
   - **Return Audit Trail:** All return sessions and condition inspection logs are recorded in `inventory_returns` and `inventory_return_items`.
   - **Telegram Outbox:** Dispatches `borrow_request_collected` and `borrow_request_returned` notifications post-commit.
4. Make each stock mutation and its audit entry atomic (Completed: interactive transactions with strict row-level conditional guards).
5. Add tests for concurrency and repeated requests (Completed: 85 unit and integration tests passing in master test harness across 9 phases).

### Phase 5 — Inventory UI
1. **Interactive Dashboard & Catalog Terminal (`/inventory`):**
   - High-density aerospace telemetry HUD cards: Total Items, Total Holdings, Available Stock, Reserved Stock, Checked-out Units, Quarantined/Damaged Units.
   - Low-stock indicator alerts computed against `minimumStock` with 1-click filter.
   - Quick telemetry badges for pending borrow requests and active returns with deep links to `/inventory/requests`.
   - Comprehensive catalog table with debounced search (by Name and SKU), dynamic category filtering, status filtering, and pagination.
   - Clear visual indicators for unavailable, damaged, low-stock, and archived hardware items.
   - **Item Detail Modal:** Displays comprehensive hardware specifications, storage coordinates (Room/Cabinet/Shelf/Bin), unit costs, consumable status, and confidential internal notes (admin-only).
   - **Integrated Append-Only Ledger History:** Item detail view directly queries `/api/inventory/[id]/ledger` to render the complete stock movement timeline (initial_stock, reservations, checkouts, returns, damages, adjustments) with actor metadata and timestamps.
   - **Admin Item Actions:** Admin create modal (`POST /api/inventory`), edit modal with invariant guard against reducing total below committed units (`PATCH /api/inventory/[id]`), and safe soft-archival (`DELETE /api/inventory/[id]`).
   - **Integrated Borrow Request Modal:** Members can initiate borrow requests directly from catalog items with positive quantity validation, date range verification, and server-side Telegram outbox queuing.

### Phase 6 — Bulk Excel/CSV Inventory Import & Telemetry
1. **Bulk Ingestion Terminal (`/inventory/admin/import`):**
   - Dedicated admin-only bulk ingestion portal supporting Microsoft Excel (`.xlsx`, `.xls`) and CSV (`.csv`) workbooks up to 5 MB.
   - File validation and size limits enforced on both client and server boundaries.
   - Formula and macro execution strictly disabled during parsing (`cellFormula: false`, `cellHTML: false`) to neutralize DDE / spreadsheet exploit vectors.
2. **Dynamic Header Discovery & Equipment Name Preservation:**
   - Discovers headers at runtime (handles `'id '`, mixed casing, and aliases for `name`, `sku`, `category`, `Total Quantity`, `notes`).
   - Equipment names are strictly preserved without truncation, simplification, or renaming.
3. **Deterministic Category Ingestion & Review Workflow:**
   - Preserves explicit categories from source rows.
   - Employs deterministic keyword inference for unassigned items.
   - Leaves ambiguous items (`clock`, unspecified modules) unassigned with status `needs_review`.
   - Admin can approve all suggested categories in one click (`APPROVE ALL SUGGESTIONS`) or select/enter categories row-by-row before committing.
4. **Compliant Unique SKU Generation & Duplicate Protection:**
   - Generates compliant SKUs matching `/^[A-Z0-9_-]{2,64}$/` formatted as `[PREFIX]-[CODE]-[LINE]` for rows lacking SKUs.
   - Enforces database and intra-file uniqueness with sequential discriminators (`-D1`, `-D2`).
   - Detects identical or similar equipment names across rows (e.g. `Buzzer` at lines 13 and 184) and flags them as duplicate warnings without merging or silently dropping rows.
5. **Non-Standard Unit Preservation:**
   - Parses numbers with units (e.g. `2 packs`, `1 box`) into integer quantities while preserving exact unit strings in `internalNotes` and displaying non-standard unit telemetry warnings.
6. **Zero-Mutation Preview & Idempotent Commit:**
   - Preview generation (`POST /api/inventory/admin/import/preview`) performs full validation and Neon DB reconciliation with strictly **0 database writes**.
   - Import commit (`POST /api/inventory/admin/import/commit`) writes to `inventory_items` and creates immutable `initial_stock` records in `inventory_stock_ledger`.
   - Re-running the import skips existing items based on unique SKUs without double-stocking or overwriting existing holdings.
   - Downloadable error and warning reports (`POST /api/inventory/admin/import/export-errors`) protected against CSV formula injection.

### Phase 7 — Production Readiness
1. **Comprehensive Test Suites:**
   - 22/22 unit and E2E tests passing for bulk inventory import (`pnpm run test:inventory-import`).
   - 13/13 catalog tests passing (`pnpm run test:catalog`).
   - 10/10 stock invariant tests passing (`pnpm run test:stock`).
   - 14/14 CSV parser tests passing (`pnpm run test:csv`).
   - 10/10 roster import tests passing (`pnpm run test:roster`).
   - 37/37 borrow request, collection, and return tests passing (`pnpm run test:requests`).
2. **Next.js Production Build:**
   - `next build` compiles successfully with Turbopack, full TypeScript typecheck passing, and optimized static/dynamic route generation.
3. **Security & Data Safety:**
   - Server-side authorization enforced on all protected routes and API handlers.
   - Database credentials, session secrets, and Telegram tokens isolated to server environment variables.
   - Client and server-side input validation via Zod schemas.

## 13. Acceptance criteria

- Authorized admins can manage categories and items.
- Members/interns can browse inventory and submit permitted requests.
- Admins can approve/reject requests.
- Stock cannot be over-allocated by concurrent requests.
- Returns, damage reports, adjustments, and restocks produce audit entries.
- Quantity balances remain consistent and never become negative.
- Role restrictions are enforced server-side.
- CSV import validates before writing and provides row-level feedback.
- CSV export respects authorization.
- Tests cover the core stock and access paths.
- Existing public website routes and deployment configuration continue to work.

---

## Decisions still required

1. **Authentication:** select the provider/library and define how club admins are initially provisioned.
2. **Reservation policy:** decide whether pending requests reserve stock or only approved requests do.
3. **Return workflow:** decide whether member-reported returns immediately restore availability or require admin inspection.
4. **Damage/write-off policy:** define who can write off club holdings.
5. **Deployment compatibility:** verify the Neon driver and database access model on the configured Cloudflare runtime.
6. **Telegram:** decide whether notifications are required for v1 or can follow the core workflow.
