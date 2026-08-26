import { NextRequest } from "next/server";
import { models } from "@/lib/ai/models";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SITE_URL = "https://gimnapp.me";
const SITE_NAME = "GimnApp AI";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const UPSTREAM_TIMEOUT = 8000;

type Api = "openrouter" | "groq";

function apiFor(modelId: string): Api {
  return models.find((m) => m.id === modelId)?.api ?? "openrouter";
}

function baseUrl(api: Api): string {
  return api === "groq"
    ? "https://api.groq.com/openai/v1/chat/completions"
    : "https://openrouter.ai/api/v1/chat/completions";
}

function keyFor(api: Api): string | undefined {
  return api === "groq" ? GROQ_API_KEY : OPENROUTER_API_KEY;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    if (!OPENROUTER_API_KEY && !GROQ_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Nije podešen nijedan AI ključ na serveru (OPENROUTER_API_KEY ili GROQ_API_KEY)." }),
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
    const otherIds = models.filter((m) => m.id !== requested).map((m) => m.id);
    const candidates = [requested, ...otherIds].slice(0, 4);

    let lastError: string | null = null;
    for (const candidate of candidates) {
      const api = apiFor(candidate);
      const key = keyFor(api);
      if (!key) {
        lastError = `Nedostaje ključ za ${api}.`;
        continue;
      }

      const modelName =
        api === "groq" && candidate.startsWith("groq/") ? candidate.slice("groq/".length) : candidate;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT);
      try {
        const upstream = await fetch(baseUrl(api), {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            ...(api === "openrouter" ? { "HTTP-Referer": SITE_URL, "X-Title": SITE_NAME } : {}),
          },
          body: JSON.stringify({
            model: modelName,
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
        lastError = `${api} nije dostupan (timeout/mreža).`;
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
