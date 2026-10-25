# Robolution Hardware Lab — Standard Operating Procedures (SOP)

**Document Version:** 1.1  
**Target Audience:** Club Executives, Inventory Managers, Domain Leads, and Members  
**Organization:** Robolution (Team Pratyumnis), Birla Institute of Technology, Mesra

---

## 1. Overview & System Objectives

The Robolution Inventory Management System tracks electronic components, development boards, sensors, tools, and mechanical hardware owned by the club.

Its objectives are to:

- Ensure hardware availability for competitions such as ABU Robocon, RoboSaga, and hackathons.
- Prevent loss, misplacement, or unaccounted damage of club assets.
- Maintain a reliable, auditable ledger of component movements.
- Provide clear stock availability, storage locations, and checkout history.

### Technical implementation reference

The planned application stack is:

- **Frontend and server-side API:** Next.js App Router with TypeScript
- **Database:** Neon PostgreSQL
- **Database access:** Drizzle ORM and migrations
- **Validation:** Zod or an equivalent server-side schema validator
- **Notifications:** Telegram Bot API, if enabled
- **Deployment:** Existing frontend deployment target, subject to compatibility checks

These implementation choices do not change the operational rules in this SOP. Secrets and database credentials must remain server-side.

---

## 2. User Roles & Access Hierarchy

The inventory system strictly operates with exactly two authorized roles: `admin` and `member`.

| Role | Permissions | Responsibilities |
|---|---|---|
| **Admin** | Full inventory access; create and update categories and items; approve/reject requests; adjust stock; import/export CSV and member rosters; review audit history. | Bulk CSV operations, member roster management, procurement, category management, and resolving discrepancies. |
| **Member** | Browse catalog and stock; request checkouts; request/record returns for their own issues; report damage; view their own history. | Return checked-out components in good condition and provide accurate project/condition information. |

### Authorization rules

- All role checks must be enforced on the server. Hiding a button in the UI is not authorization.
- The server must derive the acting user from the authenticated session; do not trust a user ID or role supplied by the client.
- Members may only view or act on their own transactions, except where an explicitly authorized admin operation applies.
- Admin-only actions must be recorded in the audit ledger.
- Unauthenticated access must not expose protected inventory data or mutations.
- The legacy `intern` role has been deprecated and migrated to `member`; all members must be assigned either `admin` or `member`.

---

## 3. Standard Operating Workflows

### 3.1 Checking Out Components (Issue)

1. **Navigate to Component:** Open `/inventory` and locate the item using search or category filters.
2. **Open Detail View:** Open the component detail page and review available quantity and location.
3. **Submit Checkout Request:**
   - Select **Request Checkout**.
   - Enter a positive quantity that does not exceed currently available stock.
   - Enter the recipient member's email address when required by the workflow.
   - Specify the project name or purpose, e.g. *ABU Robocon Chassis Prototype*.
4. **Request Review:** The request is recorded as `pending`. It does not reduce physical stock immediately, but the system must reserve the requested quantity so that concurrent requests cannot over-allocate stock.
5. **Admin Decision:** An authorized admin approves or rejects the request.
6. **Physical Retrieval:** After approval, members physically retrieve the items themselves from the designated shelf location, e.g. `Shelf A1 - Bin 2`. An admin does not physically hand over hardware.
7. **Member Collection Confirmation:**
   - The member opens `/inventory/requests` and locates the approved request.
   - The member selects **Confirm Collection** (or calls `POST /api/inventory/requests/[id]/collect`).
   - The server atomically decreases `reservedQuantity` and increases `checkedOutQuantity` in one transaction.
   - An immutable stock ledger entry (`transaction_type: 'checkout'`) is generated, and a Telegram notification is queued and dispatched post-commit.
   - The system prevents repeat collections or duplicate stock decrement.

### 3.2 Returning Components (Return)

1. **Physical & Electrical Inspection:**
   - Check header pins for bending, shorts, and visible damage.
   - For microcontrollers (e.g. ESP32, Arduino), verify that the device responds over USB/bootloader where appropriate.
   - For LiPo batteries, check cell voltages with a suitable multimeter and follow the lab's battery-safety procedures. Do not use a battery with a cell below **3.3 V**; isolate it and refer it to the responsible lab lead.
2. **Log Return in System:**
   - Open `/inventory/requests` and locate the active request (status `collected` or `partially_returned`).
   - Select **Record Return** (or call `POST /api/inventory/requests/[id]/return`).
   - Specify returned quantities per item and indicate the verified condition (`good` or `damaged`).
   - Enter mandatory condition/incident notes for damaged hardware.
   - Confirm the return submission.
3. **Stock Update & Quarantine:**
   - The server executes the return inside an atomic transaction with row-level conditional guards.
   - **Good condition units:** Decrease `checkedOutQuantity` and increase `availableQuantity`. Logged as `transaction_type: 'return'`. Usable components are returned to their designated storage bins.
   - **Damaged condition units:** Decrease `checkedOutQuantity` and increase `damagedQuantity`. Logged as `transaction_type: 'damage'`. Damaged units remain strictly quarantined and are **never** made available for borrowing.
   - If all requested items have been fully returned, the request status transitions to `returned` (completed). If some units remain outstanding, the status transitions to `partially_returned`.
   - The audit history and return sessions can be viewed at any time via **Inspect Returns** (`GET /api/inventory/requests/[id]/returns`).

### 3.3 Reporting Damaged Hardware (Write-Off)

If a component burns out, suffers mechanical fracture, or fails diagnostics:

1. Do **not** return it to active lab inventory.
2. Open the item page at `/inventory/[id]`.
3. Select **Report Damage**.
4. Enter the damaged quantity and a **mandatory incident description**, e.g. *Overvoltage applied to 5V rail during motor test*.
5. The server validates the quantity against the relevant available or checked-out balance and records the incident.
6. The stock ledger and quantity balances are updated in one database transaction. Damaged units must no longer count as available stock.
7. Preserve the incident and actor in the audit history; do not silently delete or overwrite historical records.

**Quantity policy:** If the damaged units are still part of the club's physical holdings, move them into `damagedQuantity`. Only reduce `totalQuantity` when an authorized write-off confirms that the asset has been removed from the club's holdings. The audit record must state which operation occurred.

---

## 4. SKU Naming Taxonomy

All components must follow the standard SKU prefix format.

| Prefix | Category | Example Components |
|---|---|---|
| `MC-` | Microcontrollers | `MC-001` (Arduino Uno), `MC-003` (ESP32 DevKit) |
| `SBC-` | Single-board computers | `SBC-001` (Raspberry Pi 4), `SBC-002` (Raspberry Pi Pico) |
| `SN-` | Sensors | `SN-001` (HC-SR04), `SN-002` (MPU6050 IMU), `SN-003` (IR Sensor) |
| `MD-` | Motor Drivers | `MD-001` (L298N), `MD-002` (TB6612FNG) |
| `MOT-` | Motors & Actuators | `MOT-001` (NEMA 17 Stepper), `MOT-002` (MG996R Servo) |
| `BAT-` | Batteries | `BAT-001` (11.1V 3S LiPo), `BAT-002` (18650 Li-ion Cell) |
| `PWR-` | Power Modules | `PWR-001` (LM2596 Buck Converter) |
| `COM-` | Communication Modules | `COM-001` (NRF24L01+), `COM-002` (HC-05 Bluetooth) |
| `IC-` | Integrated Circuits | `IC-001` (NE555 Timer), `IC-002` (74HC595 Shift Register) |
| `CON-` | Wires & Connectors | `CON-001` (Jumper Wires 40pk), `CON-002` (Breadboard 830pt) |
| `MEC-` | Mechanical Hardware | `MEC-001` (M3 Standoff Kit), `MEC-002` (Omni Wheels) |
| `TL-` | Tools & Equipment | `TL-001` (Soldering Station 60W), `TL-002` (Digital Multimeter) |
| `CS-` | Consumables | `CS-001` (Resistor Kit), `CS-002` (Capacitor Kit) |

SKUs must be unique. Once assigned, an SKU should not be reused for a different physical item type. SKU edits should be restricted to admins and logged.

---

## 5. Stock and Audit Rules

### 5.1 Quantity definitions

- `totalQuantity`: all units currently recorded as club holdings, including usable, reserved, checked-out, and damaged units.
- `reservedQuantity`: usable units committed to approved or pending reservations, according to the chosen reservation policy.
- `checkedOutQuantity`: units physically issued and not yet returned.
- `damagedQuantity`: units held by the club but unavailable for use because they are damaged or awaiting disposition.
- `availableQuantity`: usable units not reserved or checked out.

The application must document and consistently apply one reservation policy. A recommended rule is:

`availableQuantity = totalQuantity - reservedQuantity - checkedOutQuantity - damagedQuantity`

The system must prevent any negative quantity or reservation/checkout combination that exceeds available holdings.

### 5.2 Audit ledger

Every stock-affecting action must create an audit transaction, including:

- Checkout request and decision
- Physical checkout
- Return
- Damage report
- Stock adjustment
- Transfer between locations
- CSV import/restock
- Authorized write-off

Each ledger entry should record the item, transaction type, quantity, actor, timestamp, status, reason, and relevant location/condition metadata. Historical audit entries must not be editable or deletable through ordinary application workflows. Corrections should be recorded as new transactions.

### 5.3 Concurrency and consistency

- Perform stock checks and stock mutations on the server.
- Use PostgreSQL transactions and appropriate row locking or conditional updates to prevent two simultaneous requests from allocating the same units.
- Update quantity balances and write the corresponding ledger record in the same database transaction.
- Never accept `availableQuantity` or authoritative stock totals from the browser.

---

## 6. Bulk CSV Operations

### 6.1 Exporting Data

- `/inventory`: **Export Catalog (CSV)** for authorized catalog exports.
- `/inventory/transactions`: **Export Audit Log (CSV)** for admins.
- Exports must enforce authorization and avoid exposing internal notes or personal information to unauthorized users.
- CSV output should escape values correctly to reduce spreadsheet formula-injection risk.

### 6.2 Bulk Importing New Shipments & Consolidated Workbooks

The system includes a dedicated, aerospace-grade bulk ingestion portal at `/inventory/admin/import`.

#### Supported Formats
- Microsoft Excel (`.xlsx`, `.xls`) and RFC-4180 Comma-Separated Values (`.csv`).
- Maximum upload size: **5 MB**. Maximum rows: **5,000**.
- Formula evaluation and embedded scripts are strictly disabled during parsing (`cellFormula: false`, `cellHTML: false`) to neutralize DDE / macro vulnerabilities.

#### Header Discovery & Schema Mapping
- Column headers are discovered dynamically at runtime, handling trailing whitespace (e.g., `'id '`), mixed casing, and aliases (`name`, `item name`, `Total Quantity`, `quantity`, `qty`, `sku`, `category`, `notes`).
- Equipment names are **never** modified, shortened, or renamed to assist classification. Case and punctuation are preserved with 100% fidelity.

#### Category Ingestion & Classification Protocol
1. **Explicit Spreadsheet Categories:** If the row provides a category, it is preserved without modification.
2. **Deterministic Keyword Inferences:** For unassigned rows, a deterministic mechatronics keyword classifier suggests standard categories (`Sensors`, `Microcontrollers`, `Motor Drivers`, `Motors`, `Displays`, `Power Supplies`, `Cables & Connectors`, `Electronic Components`, `Pneumatics`, `Tools`, `Hardware`).
3. **Ambiguity Review Invariant:** Unclear items (e.g. `clock`) remain unassigned with status `needs_review`. The admin can approve all suggestions via one-click **APPROVE ALL SUGGESTIONS** or select/enter specific categories row-by-row. Rows lacking categories cannot be committed until resolved.

#### SKU Generation & Duplicate Protection
- Rows lacking SKUs automatically receive unique, standard SKUs adhering to `/^[A-Z0-9_-]{2,64}$/` in the format `[CAT_PREFIX]-[NAME_CODE]-[PADDED_LINE]` (e.g. `SENS-MICROP-002`, `MTR-SERVOM-003`).
- All SKUs are checked against the database and intra-file. Collisions are disambiguated with sequential suffixes (`-D1`, `-D2`).
- Similar equipment names across multiple rows (e.g. `Buzzer` at line 13 and `buzzer` at line 184) are flagged as **Duplicate Candidates (Warnings)**, but are strictly preserved as distinct physical items with distinct SKUs. Rows are **never** silently merged or dropped.

#### Non-Standard Unit Fidelity
- While the inventory stock schema uses integer quantities, source units such as `2 packs` or `1 box` are parsed into their integer count (`2`, `1`) and tagged with `[Non-Standard Unit]`.
- The exact original unit description is preserved in `internalNotes` (`[Source Unit: 2 packs]`) and flagged as a warning in the preview, ensuring no loss of physical context.

#### Atomic Initial Stock & Append-Only Audit Ledger
- Preview generation strictly produces **0 database writes**.
- When the admin reviews and clicks **COMMIT IMPORT**, valid rows are inserted transactionally or in safe batches into `inventory_items`.
- For each item with `totalQuantity > 0`, an append-only ledger entry is created in `inventory_stock_ledger` with:
  - `transactionType: 'initial_stock'`
  - `quantityDelta: totalQuantity`
  - `totalQuantityAfter: totalQuantity`, `availableQuantityAfter: totalQuantity`, `reservedQuantityAfter: 0`, `checkedOutQuantityAfter: 0`, `damagedQuantityAfter: 0`
  - `performedBy: adminEmail`
  - `reason: 'Bulk inventory import (batch: <batchId>) from <filename>'`
  - `metadata: { batchId, filename, sku, originalLine, unit, importedAt }`
- **Idempotency Guarantee:** If the same workbook is re-uploaded, existing database items are identified by SKU and skipped. Stock balances are **never** overwritten or double-restocked.
- **Exporting Errors:** Admins can export rejected rows via **EXPORT REPORT (.CSV)**, protected against formula injection (prepended single-quote on dangerous characters `=, +, -, @`).

---

## 7. Required Inventory Pages

- `/inventory` — searchable catalog, category filters, stock status, low-stock indicators.
- `/inventory/[id]` — item details, specifications, location, request/return/damage actions as authorized.
- `/inventory/requests` — a user's requests and permitted history.
- `/inventory/transactions` — audit log with access restrictions.
- `/inventory/admin` — admin dashboard, approvals, stock adjustments, and CSV operations.

The public marketing website should retain its own visual identity. Inventory pages should prioritize clarity, compact tables, readable stock indicators, accessible forms, and useful loading/empty/error states.

---

## 8. Acceptance Criteria

The first production-ready version must satisfy all of the following:

- Admins can create and update categories and items.
- Authenticated users can search and view inventory according to their role.
- Members and interns can submit checkout requests.
- Only authorized admins can approve or reject requests.
- Stock cannot be over-allocated by concurrent requests.
- Returns and damage reports update quantities and write audit records.
- Admin stock adjustments require a reason.
- Low-stock and out-of-stock states are computed on the server.
- CSV import validates before writing and reports row-level errors.
- CSV exports enforce role-based access.
- Every stock mutation has an audit entry.
- Tests cover quantity calculations, authorization, concurrency-sensitive workflows, and CSV validation.
- The public website continues to work.

---

## 9. Safety and Operational Notes

- Follow the lab's battery handling and storage procedures.
- Damaged or suspect batteries must be isolated and handled by an authorized lab lead.
- Do not mark unsafe hardware as available.
- The application supplements, but does not replace, physical inspection and responsible lab supervision.
