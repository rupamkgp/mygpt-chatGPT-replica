import { db } from "../../db/index.js";
import { threads } from "../../db/schema.js";
import { desc } from "drizzle-orm";

export default async (req) => {
  if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const allThreads = await db
      .select({ threadId: threads.threadId, title: threads.title, updatedAt: threads.updatedAt })
      .from(threads)
      .orderBy(desc(threads.updatedAt));

    return Response.json(allThreads);
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Failed to fetch threads" }, { status: 500 });
  }
};

export const config = {
  path: "/api/thread",
};
