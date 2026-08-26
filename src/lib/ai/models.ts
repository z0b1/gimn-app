export interface AiModel {
  id: string;
  name: string;
  provider: string;
  free: boolean;
}

export const models: AiModel[] = [
  { id: "groq/compound-mini", name: "Compound Mini", provider: "Groq", free: true },
  { id: "groq/compound", name: "Compound", provider: "Groq", free: true },
  { id: "openai/gpt-oss-120b", name: "GPT-OSS 120B", provider: "OpenAI", free: false },
  { id: "gemini/gemini-3.6-flash", name: "Gemini 3.6 Flash", provider: "Gemini", free: true },
  { id: "gemini/gemini-3.5-flash-lite", name: "Gemini 3.5 Flash-Lite", provider: "Gemini", free: true },
  { id: "gemini/gemini-3-flash-preview", name: "Gemini 3 Flash (preview)", provider: "Gemini", free: true },
];

export const defaultModel = models[0].id;
