import { NextRequest } from "next/server";
import { models } from "@/lib/ai/models";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const UPSTREAM_TIMEOUT = 15000;

const SYSTEM_PROMPT =
  "Ti si GimnApp AI, prijateljski asistent za učenike gimnazije (srednje škole). Uvek odgovaraj na srpskom jeziku (latinica ili ćirilica, prilagodi se pismu koje korisnik koristi). Koristi Markdown za formatiranje: **podebljano**, *iskošeno*, liste, i blokove koda kada je korisno.\n\nVAŽNO — poreklo aplikacije: GimnApp je razvio Božidar Mišković, učenik (solo developer) Šabačke gimnazije, kao projekat učeničkog parlamenta. NIJE tim kompanija, profesionalnih programera i edukatora. Kada te neko pita ko je razvio GimnApp, objasni da ga je razvio Božidar Mišković, taj jedan učenik škole.\n\nTvoja uloga:\n- Pomaži učenicima u učenju i razumevanju gradiva (matematika, programiranje, jezici, istorija, nauka i sl.). Objašnjavaj jasno, korak-po-korak i budi podsticajan.\n- Budi prijateljski, koristi obraćanje \"ti\" i ton prilagođen srednjoškolcima.\n- Kad učenik traži rešenje zadatka ili pripremu za test, vodi ga do rešenja i objasni postupak, umesto da daš samo gotov odgovor — cilj je da nauči.\n- Ne izmišljaj činjenice o školi, nastavnicima, događajima, rezultatima glasanja ili vestima. Za takve stvari pošalji korisnika na odgovarajući deo aplikacije (Vesti, Glasanje, Pitanja, Mapa, Kanali) ili mu reci da to proveri u aplikaciji.\n- Ako ne znaš ili nisi siguran, to priznaj — ne izmišljaj.\n- Odbij zahteve za sadržajem koji je štetan, nezakonit ili neprimeren uzrastu.";

type Provider = "groq" | "gemini";

function resolveProvider(modelId: string): {
  provider: Provider;
  base: string;
  key?: string;
  cleanId: string;
} {
  if (modelId.startsWith("gemini/")) {
    return {
      provider: "gemini",
      base: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      key: GEMINI_API_KEY,
      cleanId: modelId.slice("gemini/".length),
    };
  }
  return {
    provider: "groq",
    base: "https://api.groq.com/openai/v1/chat/completions",
    key: GROQ_API_KEY,
    cleanId: modelId,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { messages, model } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const requested =
      typeof model === "string" && model ? model : "groq/compound-mini";
    const candidates = [
      requested,
      ...models.filter((m) => m.id !== requested).map((m) => m.id),
    ].slice(0, 3);

    let lastError: string | null = null;
    for (const candidate of candidates) {
      const up = resolveProvider(candidate);

      if (!up.key) {
        const msg =
          up.provider === "gemini"
            ? "Server nema GEMINI_API_KEY — podešavanje je potrebno na hostu."
            : "Server nema GROQ_API_KEY — podešavanje je potrebno na hostu.";
        if (candidate === requested) {
          return new Response(JSON.stringify({ error: msg }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
        lastError = msg;
        continue;
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT);
      try {
        const upstream = await fetch(up.base, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${up.key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: up.cleanId,
            messages: [
              {
                role: "system",
                content: SYSTEM_PROMPT,
              },
              ...messages.map((m: { role: string; content: string }) => ({
                role: m.role,
                content: m.content,
              })),
            ],
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

        if (upstream.status === 429) {
          lastError =
            "Previše zahteva u kratkom vremenu. Sačekaj 20–30 sekundi pa pokušaj ponovo.";
          continue;
        }
        lastError = await upstream.text();
      } catch {
        clearTimeout(timer);
        lastError = `${up.provider} nije dostupan (timeout/mreža).`;
      }
    }

    return new Response(
      JSON.stringify({ error: lastError ?? "Svi modeli su zakazali." }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
