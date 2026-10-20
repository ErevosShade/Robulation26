CREATE TABLE "inventory_items" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sku" text NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"location_room" text,
	"location_cabinet" text,
	"location_shelf" text,
	"location_bin" text,
	"unit_cost" numeric(12, 2),
	"currency" text DEFAULT 'INR' NOT NULL,
	"total_quantity" integer DEFAULT 0 NOT NULL,
	"reserved_quantity" integer DEFAULT 0 NOT NULL,
	"checked_out_quantity" integer DEFAULT 0 NOT NULL,
	"damaged_quantity" integer DEFAULT 0 NOT NULL,
	"minimum_stock" integer DEFAULT 0 NOT NULL,
	"consumable" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"archived_at" timestamp,
	"internal_notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "inventory_items_slug_unique" UNIQUE("slug"),
	CONSTRAINT "inventory_items_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "inventory_stock_ledger" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"transaction_type" text NOT NULL,
	"quantity_delta" integer NOT NULL,
	"total_quantity_after" integer NOT NULL,
	"available_quantity_after" integer NOT NULL,
	"reserved_quantity_after" integer NOT NULL,
	"checked_out_quantity_after" integer NOT NULL,
	"damaged_quantity_after" integer NOT NULL,
	"performed_by" text NOT NULL,
	"reason" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inventory_stock_ledger" ADD CONSTRAINT "inventory_stock_ledger_item_id_inventory_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."inventory_items"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_items_sku_idx" ON "inventory_items" USING btree ("sku");--> statement-breakpoint
CREATE UNIQUE INDEX "inventory_items_slug_idx" ON "inventory_items" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "inventory_items_category_idx" ON "inventory_items" USING btree ("category");--> statement-breakpoint
CREATE INDEX "inventory_items_name_idx" ON "inventory_items" USING btree ("name");--> statement-breakpoint
CREATE INDEX "inventory_items_active_archived_idx" ON "inventory_items" USING btree ("active","archived");--> statement-breakpoint
CREATE INDEX "inventory_ledger_item_id_idx" ON "inventory_stock_ledger" USING btree ("item_id");--> statement-breakpoint
CREATE INDEX "inventory_ledger_created_at_idx" ON "inventory_stock_ledger" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "inventory_ledger_type_idx" ON "inventory_stock_ledger" USING btree ("transaction_type");