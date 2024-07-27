CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram_id" integer NOT NULL,
	"username" text,
	"first_name" text,
	"last_name" text,
	"wallet_address" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"balance" numeric(18, 8) DEFAULT '0',
	CONSTRAINT "users_telegram_id_unique" UNIQUE("telegram_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wallets" (
	"id" serial PRIMARY KEY NOT NULL,
	"mnemonic" text NOT NULL,
	"user_id" serial NOT NULL,
	"address" text NOT NULL,
	"wallet_pk" text NOT NULL
);