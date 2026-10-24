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
3. Implement physical checkout, returns, damage reports, and adjustments (Next milestone).
4. Make each stock mutation and its audit entry atomic.
5. Add tests for concurrency and repeated requests (Completed: 58 unit and integration tests passing in test harness).

### Phase 5 — Inventory UI
1. Build `/inventory` catalog and dashboard.
2. Build item detail and request pages.
3. Build admin approvals and transaction history.
4. Add loading, empty, validation, and error states.

### Phase 6 — CSV and notifications
1. Add catalog and audit exports.
2. Add validated CSV import.
3. Integrate Telegram notifications (Completed: reusable client, token redaction, connection verification, admin test endpoint).
4. Verify duplicate/forged Telegram callback protection.

### Phase 7 — Production readiness
1. Run lint, type checks, tests, and production build.
2. Test on the actual Cloudflare deployment target.
3. Verify database persistence, secrets, access controls, and backups.
4. Document operational procedures.

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
