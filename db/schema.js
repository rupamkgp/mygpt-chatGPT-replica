import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const threads = pgTable("threads", {
  id: serial().primaryKey(),
  threadId: text("thread_id").notNull().unique(),
  title: text().notNull().default("new chat"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial().primaryKey(),
  threadId: text("thread_id").notNull().references(() => threads.threadId, { onDelete: "cascade" }),
  role: text().notNull(),
  content: text().notNull(),
  timestamp: timestamp().defaultNow(),
});
