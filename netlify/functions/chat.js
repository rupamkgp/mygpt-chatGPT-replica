import { db } from "../../db/index.js";
import { threads, messages } from "../../db/schema.js";
import { eq } from "drizzle-orm";

const getAIResponse = async (message) => {
  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: message }],
    }),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`NVIDIA API returned status ${response.status}: ${errBody}`);
  }

  const data = await response.json();
  return data.choices[0].message.content || "No response content.";
};

export default async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { threadId, message } = await req.json();

  if (!threadId || !message) {
    return Response.json({ error: "missing required fields" }, { status: 400 });
  }

  try {
    const existing = await db.select().from(threads).where(eq(threads.threadId, threadId));

    if (!existing.length) {
      await db.insert(threads).values({ threadId, title: message });
    }

    await db.insert(messages).values({ threadId, role: "user", content: message });

    const assistantReply = await getAIResponse(message);

    await db.insert(messages).values({ threadId, role: "assistant", content: assistantReply });

    await db.update(threads).set({ updatedAt: new Date() }).where(eq(threads.threadId, threadId));

    return Response.json({ reply: assistantReply });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "something went wrong" }, { status: 500 });
  }
};

export const config = {
  path: "/api/chat",
};
