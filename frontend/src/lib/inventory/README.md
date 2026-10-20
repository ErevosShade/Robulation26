# Robolution Inventory Backend & Stock Architecture

## 1. Overview
The Robolution Hardware Lab inventory system provides an authoritative, server-derived catalog of lab assets (microcontrollers, sensors, development kits, tools, actuators). It enforces strict stock conservation invariants, server-side role-based authorization (`admin` and `member`), and immutable ledger auditing.

---

## 2. Inventory Data Model

### 2.1 Item Identity & Storage Metadata
- **`id`**: Unique primary key (`text` / UUID v4).
- **`name`**: Item title (e.g. `STM32F401 Development Board`). Required, trimmed.
- **`slug`**: URL-friendly unique identifier (e.g. `stm32f401-dev-board`).
- **`sku`**: Stable unique stock keeping unit (e.g. `MCU-STM32-001`). Required, uppercase alphanumeric + dashes.
- **`category`**: Plain-text category label (e.g. `Microcontrollers`, `Sensors`, `Actuators`).
- **`description`**: Detailed markdown/text item description and specifications.
- **`tags`**: Array of string tags for quick filtering (e.g. `["arm", "cortex-m4", "3.3v"]`).
- **Location Hierarchy**:
  - `locationRoom`: e.g. `Lab 204`
  - `locationCabinet`: e.g. `Cabinet C`
  - `locationShelf`: e.g. `Shelf 3`
  - `locationBin`: e.g. `Bin B2`
- **Valuation**:
  - `unitCost`: Decimal unit cost in specified currency.
  - `currency`: Default `INR`.

### 2.2 Stock Accounting & Invariants
Physical club holdings and usable availability are strictly distinguished:

| Quantity Field | Definition |
|---|---|
| `totalQuantity` | Physical total holdings owned by the club. |
| `availableQuantity` | Computed usable stock available for immediate borrowing. |
| `reservedQuantity` | Quantity committed to admin-approved borrowing requests pending physical collection. |
| `checkedOutQuantity` | Quantity physically issued to members and currently outside the lab. |
| `damagedQuantity` | Quantity physically damaged or non-functional but still retained by the club. |
| `minimumStock` | Threshold below which the item triggers low-stock alerts. |

#### Mathematical Invariant
$$\text{availableQuantity} = \text{totalQuantity} - (\text{reservedQuantity} + \text{checkedOutQuantity} + \text{damagedQuantity})$$

$$\text{totalQuantity} \ge \text{reservedQuantity} + \text{checkedOutQuantity} + \text{damagedQuantity}$$

- All individual quantities must be non-negative integers ($\ge 0$).
- Available stock cannot exceed total holdings.
- Total holdings cannot be decreased below active commitments ($\text{reservedQuantity} + \text{checkedOutQuantity}$).

#### Reservation Policy
- **Pending borrowing requests DO NOT reserve stock.**
- Stock is reserved **only** when an authorized admin formally approves a borrowing request.
- At approval time, the server atomically verifies `availableQuantity >= requestedQuantity` and increments `reservedQuantity`.

---

## 3. Server-Derived Status Matrix

Stock status is derived exclusively on the server:

```typescript
if (item.archived || !item.active) {
  return "archived";
} else if (availableQuantity <= 0) {
  return "out_of_stock";
} else if (availableQuantity <= item.minimumStock) {
  return "low_stock";
} else {
  return "in_stock";
}
```

---

## 4. Security & Role Authorization

- **Two Roles Only**: `admin` and `member`.
- **Role Source**: Derived exclusively from the live server-side `member_roster` row. Client-supplied roles or identity headers are completely ignored.
- **Catalog Browsing (`GET /api/inventory`, `GET /api/inventory/[id]`)**: Allowed for verified `admin` and `member` accounts.
- **Internal Notes**: Restricted to `admin` callers; sanitized and omitted from responses to `member` callers.
- **Mutations (`POST`, `PATCH`, `DELETE`)**: Strictly restricted to `admin` callers.

---

## 5. Stock Ledger & Audit Architecture

Every stock-affecting operation records an immutable row in `inventory_stock_ledger`:
- `itemId`: Target item ID.
- `transactionType`: `initial_stock` | `adjustment` | `reservation` | `checkout` | `return` | `damage` | `write_off` | `archival`.
- `quantityDelta`: Signed integer delta reflecting the mutation.
- `performedBy`: Email of the acting administrator or member.
- `reason`: Mandatory explanatory text for audit trails.
- `createdAt`: Timestamp of operation.
