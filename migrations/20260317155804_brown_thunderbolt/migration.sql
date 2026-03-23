CREATE TABLE "promocodes" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "promocodes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"user_id" bigint UNIQUE,
	"code" text NOT NULL,
	"raffled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "users" ALTER COLUMN "telegram_id" SET NOT NULL;
ALTER TABLE "promocodes" ADD CONSTRAINT "promocodes_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id");