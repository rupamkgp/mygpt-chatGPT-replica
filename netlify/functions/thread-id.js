import { db } from "../../db/index.js";
import { threads, messages } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req, context) => {
  const { threadId } = context.params;

  if (req.method === "GET") {
    try {
      const thread = await db.select().from(threads).where(eq(threads.threadId, threadId));

      if (!thread.length) {
        return Response.json({ error: "Thread not found" }, { status: 404 });
      }

      const msgs = await db
        .select({ role: messages.role, content: messages.content, timestamp: messages.timestamp })
        .from(messages)
        .where(eq(messages.threadId, threadId))
        .orderBy(messages.timestamp);

      return Response.json(msgs);
    } catch (err) {
      console.error(err);
      return Response.json({ error: "Failed to fetch chat" }, { status: 500 });
    }
  }

  if (req.method === "DELETE") {
    try {
      const deleted = await db.delete(threads).where(eq(threads.threadId, threadId)).returning();

      if (!deleted.length) {
        return Response.json({ error: "Thread not found" }, { status: 404 });
      }

      return Response.json({ success: "Thread deleted successfully" });
    } catch (err) {
      console.error(err);
      return Response.json({ error: "Failed to delete thread" }, { status: 500 });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = {
  path: "/api/thread/:threadId",
};
