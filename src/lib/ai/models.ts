export interface AiModel {
  id: string;
  name: string;
  provider: string;
  free: boolean;
}

export const models: AiModel[] = [
  { id: "groq/compound-mini", name: "Compound Mini", provider: "Groq", free: true },
  { id: "groq/compound", name: "Compound", provider: "Groq", free: true },
];

export const defaultModel = models[0].id;
