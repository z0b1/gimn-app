export interface AiModel {
  id: string;
  name: string;
  provider: string;
  free: boolean;
}

export const models: AiModel[] = [
  { id: "groq/llama-3.3-70b-versatile", name: "Llama 3.3 70B", provider: "Groq", free: true },
  { id: "groq/llama-3.1-8b-instant", name: "Llama 3.1 8B Instant", provider: "Groq", free: true },
  { id: "groq/mixtral-8x7b-32768", name: "Mixtral 8x7B", provider: "Groq", free: true },
];

export const defaultModel = models[0].id;
