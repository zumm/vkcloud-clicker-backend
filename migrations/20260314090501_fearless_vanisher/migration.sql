-- Custom SQL migration file, put your code below! --
ALTER TABLE "click_sessions" ADD CONSTRAINT "click_sessions_no_overlapping" EXCLUDE USING GIST (tstzrange("started_at", "ended_at", '[)') WITH &&);
