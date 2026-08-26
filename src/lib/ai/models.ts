export interface AiModel {
  id: string;
  name: string;
  provider: string;
  free: boolean;
  api: "openrouter" | "groq";
}

export const models: AiModel[] = [
  // Groq — fast, free, no queue (default)
  { id: "groq/llama-3.3-70b-versatile", name: "Llama 3.3 70B", provider: "Groq", free: true, api: "groq" },
  { id: "groq/llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", provider: "Groq", free: true, api: "groq" },
  { id: "groq/mixtral-8x7b-32768", name: "Mixtral 8x7B", provider: "Groq", free: true, api: "groq" },

  // OpenRouter — free, but can queue on serverless
  { id: "z-ai/glm-5.2:free", name: "GLM 5.2", provider: "Z-AI", free: true, api: "openrouter" },
  { id: "nvidia/nemotron-3-ultra-550b-a55b:free", name: "Nemotron 3 Ultra", provider: "NVIDIA", free: true, api: "openrouter" },
  { id: "nvidia/nemotron-3-super-120b-a12b:free", name: "Nemotron 3 Super 120B", provider: "NVIDIA", free: true, api: "openrouter" },
  { id: "minimax/minimax-m3:free", name: "MiniMax M3", provider: "MiniMax", free: true, api: "openrouter" },
  { id: "minimax/minimax-m2.7:free", name: "MiniMax M2.7", provider: "MiniMax", free: true, api: "openrouter" },
  { id: "google/gemma-4-31b-it:free", name: "Gemma 4 31B", provider: "Google", free: true, api: "openrouter" },
  { id: "google/gemma-4-26b-a4b-it:free", name: "Gemma 4 26B", provider: "Google", free: true, api: "openrouter" },
  { id: "nvidia/nemotron-3.5-lightning:free", name: "Nemotron 3.5 Lightning", provider: "NVIDIA", free: true, api: "openrouter" },
  { id: "thinkingmachines/inkling:free", name: "Inkling", provider: "Thinking Machines", free: true, api: "openrouter" },
  { id: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", name: "Nemotron Nano Reasoning", provider: "NVIDIA", free: true, api: "openrouter" },
];

export const defaultModel = models[0].id;
