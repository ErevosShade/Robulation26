ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'member';
--> statement-breakpoint
UPDATE "member_roster" SET "role" = 'member', "updated_at" = NOW() WHERE "role" = 'intern';
--> statement-breakpoint
UPDATE "user" SET "role" = 'member', "updated_at" = NOW() WHERE "role" = 'intern';
