CREATE TYPE "booster_type" AS ENUM('CLICK_MULTIPLIER', 'CLICK_ADDITIVE');
CREATE TYPE "ledger_source_type" AS ENUM('CLICKS');
CREATE TABLE "boosters" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "boosters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"type" "booster_type" NOT NULL,
	"duration" interval,
	"value" real NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "click_sessions" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "click_sessions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint NOT NULL,
	"total_clicks" smallint NOT NULL,
	"started_at" timestamp with time zone NOT NULL,
	"ended_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "gifts" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gifts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"url" text NOT NULL,
	"target" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "ledger" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ledger_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint NOT NULL,
	"source_type" "ledger_source_type" NOT NULL,
	"source_id" bigint,
	"amount" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "user_boosters" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_boosters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint NOT NULL,
	"booster_id" bigint NOT NULL,
	"activated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "users" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"telegram_id" bigint UNIQUE,
	"name" text,
	"photo_url" text,
	"first_name" text,
	"last_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE "wallets" (
	"user_id" bigint PRIMARY KEY,
	"balance" bigint DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX "gifts_target_index" ON "gifts" ("target");
CREATE INDEX "user_boosters_user_id_activated_at_expires_at_index" ON "user_boosters" ("user_id","activated_at","expires_at");
ALTER TABLE "click_sessions" ADD CONSTRAINT "click_sessions_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "ledger" ADD CONSTRAINT "ledger_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "user_boosters" ADD CONSTRAINT "user_boosters_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");
ALTER TABLE "user_boosters" ADD CONSTRAINT "user_boosters_booster_id_boosters_id_fkey" FOREIGN KEY ("booster_id") REFERENCES "boosters"("id");
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");