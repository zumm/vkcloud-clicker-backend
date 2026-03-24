-- Custom SQL migration file, put your code below! --
CREATE EXTENSION IF NOT EXISTS "btree_gist";

ALTER TABLE "click_sessions" DROP CONSTRAINT "click_sessions_no_overlapping";
ALTER TABLE "click_sessions" ADD CONSTRAINT "click_sessions_no_overlapping" EXCLUDE USING GIST ("user_id" WITH =, tstzrange("started_at", "ended_at", '[)') WITH &&);
