import { NextRequest } from "next/server";
import { models } from "@/lib/ai/models";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const SITE_URL = "https://gimnapp.me";
const SITE_NAME = "GimnApp AI";

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    if (!OPENROUTER_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const requested = typeof model === "string" && model ? model : "z-ai/glm-5.2:free";
    const freeIds = models.filter((m) => m.free).map((m) => m.id);
    const candidates = [requested, ...freeIds.filter((id) => id !== requested)].slice(0, 5);

    let lastError: string | null = null;
    for (const candidate of candidates) {
      const upstream = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
        },
        body: JSON.stringify({
          model: candidate,
          messages: messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
          stream: true,
        }),
      });

      if (upstream.ok) {
        return new Response(upstream.body, {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        });
      }

      lastError = await upstream.text();
    }

    return new Response(JSON.stringify({ error: lastError ?? "All models failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
