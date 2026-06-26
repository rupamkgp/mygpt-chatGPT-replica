CREATE TABLE "messages" (
	"id" serial PRIMARY KEY,
	"thread_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"id" serial PRIMARY KEY,
	"thread_id" text NOT NULL UNIQUE,
	"title" text DEFAULT 'new chat' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_thread_id_threads_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "threads"("thread_id") ON DELETE CASCADE;