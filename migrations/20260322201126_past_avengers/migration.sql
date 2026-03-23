ALTER TABLE "settings" ADD COLUMN "bot_admin_ids" jsonb DEFAULT '[]' NOT NULL;
ALTER TABLE "settings" ALTER COLUMN "campaign_state" SET DEFAULT 'LIVE'::"campaign_state";