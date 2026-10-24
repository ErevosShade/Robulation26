CREATE TABLE "inventory_request_items" (
	"id" text PRIMARY KEY NOT NULL,
	"request_id" text NOT NULL,
	"item_id" text NOT NULL,
	"quantity" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_request_items_positive_quantity_check" CHECK ("inventory_request_items"."quantity" > 0)
);
--> statement-breakpoint
CREATE TABLE "inventory_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"user_email" text NOT NULL,
	"user_name" text NOT NULL,
	"project" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"admin_notes" text,
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_requests_dates_valid_check" CHECK ("inventory_requests"."end_date" >= "inventory_requests"."start_date"),
	CONSTRAINT "inventory_requests_status_check" CHECK ("inventory_requests"."status" IN ('pending', 'approved', 'rejected', 'cancelled'))
);
--> statement-breakpoint
CREATE TABLE "inventory_notification_outbox" (
	"id" text PRIMARY KEY NOT NULL,
	"channel" text DEFAULT 'telegram' NOT NULL,
	"event_type" text NOT NULL,
	"reference_id" text NOT NULL,
	"payload" jsonb NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 5 NOT NULL,
	"last_attempt_at" timestamp,
	"delivered_at" timestamp,
	"last_error" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_outbox_status_check" CHECK ("inventory_notification_outbox"."status" IN ('pending', 'delivered', 'failed')),
	CONSTRAINT "inventory_outbox_attempts_check" CHECK ("inventory_notification_outbox"."attempts" >= 0)
);
--> statement-breakpoint
ALTER TABLE "inventory_request_items" ADD CONSTRAINT "inventory_request_items_request_id_inventory_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."inventory_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_request_items" ADD CONSTRAINT "inventory_request_items_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."inventory_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inventory_request_items_request_id_idx" ON "inventory_request_items" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "inventory_request_items_item_id_idx" ON "inventory_request_items" USING btree ("item_id");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_request_items_unique_item_idx" ON "inventory_request_items" USING btree ("request_id","item_id");--> statement-breakpoint
CREATE INDEX "inventory_requests_user_id_idx" ON "inventory_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "inventory_requests_status_idx" ON "inventory_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "inventory_requests_created_at_idx" ON "inventory_requests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "inventory_outbox_status_created_idx" ON "inventory_notification_outbox" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "inventory_outbox_reference_id_idx" ON "inventory_notification_outbox" USING btree ("reference_id");