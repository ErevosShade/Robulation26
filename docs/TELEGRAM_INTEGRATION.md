# Telegram Notification Integration Guide

This guide documents the architecture, local setup, security invariants, and Cloudflare/OpenNext deployment instructions for the Robolution26 inventory Telegram notification system.

---

## 1. Architecture Overview

The Telegram integration is implemented as a server-only service in `frontend/src/lib/telegram/`. It provides:

- **Isolated server-only client:** Sends HTML-formatted messages to the Robolution Telegram channel using the Telegram Bot API (`sendMessage`).
- **Zero credential leakage:** Automatically masks and redacts bot tokens from URLs, error messages, stack traces, and API responses.
- **Strict network deadlines:** Enforces an 8-second fetch timeout with `AbortController` to prevent serverless function hangs.
- **Admin-only connection verification:** Protected API endpoint at `POST /api/inventory/admin/telegram/test` allowing authorized administrators to dispatch an authenticated connection-test notification.
- **No open-relay abuse:** The test endpoint constructs a fixed, sanitized status payload (`formatConnectionTestMessage`) with the admin's verified email and timestamp; clients cannot supply arbitrary message text.

---

## 2. Telegram Bot & Channel Configuration

### A. Bot Creation
1. Message [`@BotFather`](https://t.me/BotFather) on Telegram.
2. Send `/newbot` and follow the prompts to choose a display name and username (e.g. `RobolutionInventoryBot`).
3. Save the generated bot token: `<bot_id>:<token_secret>`.

### B. Group / Channel Configuration
1. Create or open the Robolution inventory group or supergroup.
2. Add the bot to the group as an **Administrator** with permission to **Post Messages**.
3. Send a test message in the group, then query:
   ```bash
   curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
   ```
4. Locate the `chat.id` in the JSON response (supergroup IDs start with `-100`, or standard group IDs start with `-`).

---

## 3. Local Environment Setup

Add the credentials to `frontend/.env.local`:

```env
# Telegram Bot Integration
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrSTUvwxYZ_example_token
TELEGRAM_CHANNEL_ID=-1001234567890
```

> **Security Rule:** Never commit `.env.local` to version control. The repository's `.gitignore` strictly ignores `.env.local` and all `.env*` files except `.env.example`.

### Running Verification Tests

- **Mocked Unit Tests (Safe, 0 network calls):**
  ```bash
  cd frontend
  pnpm run test:telegram
  ```
  Runs 15 test assertions covering configuration detection, quotation trimming, URL token redaction, timeout handling, mocked delivery, and admin route authorization.

- **Live Telegram Connection Verification:**
  ```bash
  cd frontend
  pnpm run test:telegram:live
  ```
  Dispatches an authentic test notification to the configured channel using credentials in `.env.local` and logs the resulting Telegram message ID.

---

## 4. Cloudflare Workers / OpenNext Deployment

Robolution26 is deployed to Cloudflare Workers via OpenNext (`opennextjs-cloudflare`).

In the Cloudflare Workers environment, sensitive credentials must be provisioned as Cloudflare Secrets rather than plaintext environment variables.

### Provisioning Secrets via Wrangler CLI
From the `frontend` directory:

```bash
# Add Telegram bot token secret
pnpm wrangler secret put TELEGRAM_BOT_TOKEN

# Add Telegram channel / group ID secret
pnpm wrangler secret put TELEGRAM_CHANNEL_ID
```

When prompted, paste the exact credential values without surrounding quotes.

### Cloudflare Dashboard Provisioning (Alternative)
1. Navigate to **Cloudflare Dashboard > Workers & Pages > Robolution26**.
2. Go to **Settings > Variables and Secrets**.
3. Under **Environment Variables**, click **Add** and select **Secret (encrypted)**:
   - Variable name: `TELEGRAM_BOT_TOKEN`
   - Variable name: `TELEGRAM_CHANNEL_ID`
4. Deploy the worker:
   ```bash
   pnpm run deploy
   ```

OpenNext automatically binds these environment variables to `process.env` during request handling inside Cloudflare Workers.

---

## 5. Security & Rate Limiting

- **Token Redaction:** `maskTelegramToken()` scrubs any matching `bot<id>:<token>` patterns or bare token strings from error payloads before they leave the server boundary.
- **Rate Limits:** Telegram allows up to 30 messages/second globally across chats and up to 20 messages/minute within a single supergroup. The notification client is designed for inventory event alerts and will not exceed these thresholds.
- **Fail-Closed Design:** If Telegram is unreachable or credentials are unconfigured, operations report standard HTTP error codes (`503 NOT_CONFIGURED`, `502 DELIVERY_FAILED`) without disrupting inventory database state.

---

## 6. Hardware Borrow Request Notifications & Transactional Outbox

When a new hardware borrowing request is submitted via `POST /api/inventory/requests`, an alert is dispatched to the configured Telegram channel:

### A. Message Structure & Entity Escaping
All user-supplied content (requester names, project descriptions, component names, and SKUs) is passed through `escapeTelegramHtml()`, converting `<`, `>`, `&`, `"`, and `'` into safe HTML entities to prevent HTML injection and layout distortion:

```text
📋 NEW HARDWARE BORROW REQUEST
📡 Robolution Mechatronics Lab

Request ID: 636c76c0-9d3e-4aa5-9c9b-e70851bff62e
Requester: Alex Vance (alex.vance@robolution.space)
Project / Purpose: Autonomous Mars Rover Navigation Subsystem
Timeline: 2026-11-01 ➔ 2026-11-05
Status: 🟡 PENDING

Requested Items (2):
  1. LiDAR Puck v1 (TEST-ITEM-A) — 4 unit(s)
  2. NVIDIA Jetson Nano (TEST-ITEM-B) — 2 unit(s)

Review required in the Robolution inventory admin terminal.
```

### B. Durable Outbox Architecture
1. **Zero Data Loss:** Borrow requests and their notification payloads are saved atomically to `inventory_requests` and `inventory_notification_outbox`.
2. **Decoupled Delivery:** Telegram network failures never abort, rollback, or invalidate successfully saved borrow requests.
3. **Idempotency & Duplicate Prevention:** The outbox verifies `status === 'delivered'` prior to any send attempt. Retrying an already delivered event is a no-op (`skipped: true`).
4. **Retry Service:** Undelivered or failed notifications can be safely retried via `retryPendingOutboxNotifications()`.
5. **Mock Mode:** Setting `TELEGRAM_MOCK_MODE=true` (or passing `{ mockMode: true }`) enables offline execution with deterministic mock message IDs and zero external HTTP calls.

---

## 7. Review Outcome Notifications (Approval & Rejection)

When an administrator reviews a borrowing request via `POST /api/inventory/requests/[id]/approve` or `POST /api/inventory/requests/[id]/reject`:

### A. Approval Notification Structure
When approved, stock is reserved in the inventory ledger and a confirmation notification is dispatched:

```text
✅ HARDWARE BORROW REQUEST APPROVED & RESERVED
📡 Robolution Mechatronics Lab

Request ID: req-appr-001
Status: 🟢 APPROVED
Requester: Elena Rostova (elena@robolution.space)
Reviewed By: Sarah Connor (sarah.admin@robolution.space)
Project / Purpose: Sub-orbital Avionics & Sensor Array
Timeline: 2026-11-10 ➔ 2026-11-20

Components (2):
  1. Pixhawk 6X Autopilot (FLT-PIX-001) — 2 unit(s)
  2. Here3+ Precision GNSS (NAV-HERE3-01) — 2 unit(s)

Review Note: Approved for flight testing. Return cleaned.

🔒 Stock allocated to reservation balance in lab ledger.
```

### B. Rejection Notification Structure
When rejected, zero stock quantities or ledger rows are mutated, and an alert detailing the review rationale is dispatched:

```text
❌ HARDWARE BORROW REQUEST REJECTED
📡 Robolution Mechatronics Lab

Request ID: req-rej-002
Status: 🔴 REJECTED
Requester: Alex Vance (alex.vance@robolution.space)
Reviewed By: Sarah Connor (sarah.admin@robolution.space)
Project / Purpose: Rover High-Stress Impact Test
Timeline: 2026-11-01 ➔ 2026-11-03

Components (1):
  1. Titanium Chassis Strut (MECH-TITAN-01) — 4 unit(s)

Review Note: Declined: Insufficient spare parts for destructive testing.
```

### C. Outbox Guarantees
- The notification event (`borrow_request_approved` or `borrow_request_rejected`) is persisted to `inventory_notification_outbox` inside the same Neon database transaction as the reservation and status update.
- The message is dispatched asynchronously post-commit.
- In the event of network disruption or Telegram rate limits, the request status and inventory reservations remain fully committed and safe, and the notification can be redelivered via `retryPendingOutboxNotifications()`.


