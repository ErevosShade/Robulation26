-- Robolution26 Migration 0005: Member Collection & Return Lifecycle Schema
-- Safe forward-only additions for request collection confirmation, return events, condition tracking, and return items.

-- 1. Expand status check on inventory_requests to support collection and return lifecycle
ALTER TABLE "inventory_requests" DROP CONSTRAINT IF EXISTS "inventory_requests_status_check";
ALTER TABLE "inventory_requests" ADD CONSTRAINT "inventory_requests_status_check" CHECK ("status" IN ('pending', 'approved', 'rejected', 'cancelled', 'collected', 'partially_returned', 'returned'));

-- 2. Add collection metadata columns to inventory_requests
ALTER TABLE "inventory_requests" ADD COLUMN IF NOT EXISTS "collected_by" text;
ALTER TABLE "inventory_requests" ADD COLUMN IF NOT EXISTS "collected_at" timestamp;

-- 3. Add returned quantity columns and checks to inventory_request_items
ALTER TABLE "inventory_request_items" ADD COLUMN IF NOT EXISTS "returned_good_quantity" integer DEFAULT 0 NOT NULL;
ALTER TABLE "inventory_request_items" ADD COLUMN IF NOT EXISTS "returned_damaged_quantity" integer DEFAULT 0 NOT NULL;

ALTER TABLE "inventory_request_items" DROP CONSTRAINT IF EXISTS "inventory_request_items_returned_quantity_check";
ALTER TABLE "inventory_request_items" ADD CONSTRAINT "inventory_request_items_returned_quantity_check" CHECK ("quantity" >= ("returned_good_quantity" + "returned_damaged_quantity"));

ALTER TABLE "inventory_request_items" DROP CONSTRAINT IF EXISTS "inventory_request_items_non_negative_returns_check";
ALTER TABLE "inventory_request_items" ADD CONSTRAINT "inventory_request_items_non_negative_returns_check" CHECK ("returned_good_quantity" >= 0 AND "returned_damaged_quantity" >= 0);

-- 4. Create inventory_returns table
CREATE TABLE IF NOT EXISTS "inventory_returns" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"returned_by" text NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_returns_request_id_inventory_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."inventory_requests"("id") ON DELETE cascade ON UPDATE no action
);

CREATE INDEX IF NOT EXISTS "inventory_returns_request_id_idx" ON "inventory_returns" USING btree ("request_id");
CREATE INDEX IF NOT EXISTS "inventory_returns_created_at_idx" ON "inventory_returns" USING btree ("created_at");

-- 5. Create inventory_return_items table
CREATE TABLE IF NOT EXISTS "inventory_return_items" (
	"id" text PRIMARY KEY NOT NULL,
	"return_id" text NOT NULL,
	"item_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"condition" text NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_return_items_positive_qty_check" CHECK ("quantity" > 0),
	CONSTRAINT "inventory_return_items_condition_check" CHECK ("condition" IN ('good', 'damaged')),
	CONSTRAINT "inventory_return_items_return_id_inventory_returns_id_fk" FOREIGN KEY ("return_id") REFERENCES "public"."inventory_returns"("id") ON DELETE cascade ON UPDATE no action,
	CONSTRAINT "inventory_return_items_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."inventory_items"("id") ON DELETE restrict ON UPDATE no action
);

CREATE INDEX IF NOT EXISTS "inventory_return_items_return_id_idx" ON "inventory_return_items" USING btree ("return_id");
CREATE INDEX IF NOT EXISTS "inventory_return_items_item_id_idx" ON "inventory_return_items" USING btree ("item_id");
