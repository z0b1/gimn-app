import { NextRequest } from "next/server";
import { models } from "@/lib/ai/models";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const UPSTREAM_TIMEOUT = 15000;

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    if (!GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Server nema GROQ_API_KEY — podešavanje je potrebno na hostu." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const requested = typeof model === "string" && model ? model : "groq/llama-3.3-70b-versatile";
    const modelName = requested.startsWith("groq/") ? requested.slice("groq/".length) : requested;
    const otherNames = models
      .filter((m) => m.id !== requested)
      .map((m) => (m.id.startsWith("groq/") ? m.id.slice("groq/".length) : m.id));
    const candidates = [modelName, ...otherNames].slice(0, 3);

    let lastError: string | null = null;
    for (const candidate of candidates) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT);
      try {
        const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: candidate,
            messages: messages.map((m: { role: string; content: string }) => ({
              role: m.role,
              content: m.content,
            })),
            stream: true,
          }),
          signal: controller.signal,
        });
        clearTimeout(timer);

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
      } catch {
        clearTimeout(timer);
        lastError = "Groq nije dostupan (timeout/mreža).";
      }
    }

    return new Response(JSON.stringify({ error: lastError ?? "Svi modeli su zakazali." }), {
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
