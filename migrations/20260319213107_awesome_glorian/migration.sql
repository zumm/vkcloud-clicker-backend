CREATE TABLE "milestones" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "milestones_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"target" bigint NOT NULL,
	"booster_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX "milestones_target_index" ON "milestones" ("target");
ALTER TABLE "milestones" ADD CONSTRAINT "milestones_booster_id_boosters_id_fkey" FOREIGN KEY ("booster_id") REFERENCES "boosters"("id");