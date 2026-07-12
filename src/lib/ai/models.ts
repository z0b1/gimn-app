export interface AiModel {
  id: string;
  name: string;
  provider: string;
  free: boolean;
}

export const models: AiModel[] = [
  // DeepSeek
  { id: "deepseek/deepseek-3.2", name: "DeepSeek 3.2", provider: "DeepSeek", free: true },
  { id: "deepseek/deepseek-4-flash", name: "DeepSeek 4 Flash", provider: "DeepSeek", free: true },
  { id: "deepseek/deepseek-v4-pro", name: "DeepSeek V4 Pro", provider: "DeepSeek", free: false },
  { id: "deepseek/dsv4-fast", name: "DS V4 Fast", provider: "DeepSeek", free: true },
  { id: "deepseek/dsv4-normal", name: "DS V4 Normal", provider: "DeepSeek", free: true },

  // GLM
  { id: "glm/glm-5", name: "GLM-5", provider: "GLM", free: true },
  { id: "glm/glm5.1-fast", name: "GLM 5.1 Fast", provider: "GLM", free: true },
  { id: "glm/glm5.1-normal", name: "GLM 5.1 Normal", provider: "GLM", free: true },
  { id: "glm/glm5.2-fast", name: "GLM 5.2 Fast", provider: "GLM", free: true },
  { id: "glm/glm5.2-normal", name: "GLM 5.2 Normal", provider: "GLM", free: true },

  // GPT-OSS
  { id: "openai/gpt-oss-fast", name: "GPT-OSS Fast", provider: "OpenAI", free: true },
  { id: "openai/gpt-oss-normal", name: "GPT-OSS Normal", provider: "OpenAI", free: true },
  { id: "openai/openai-gpt-oss-120b", name: "GPT-OSS 120B", provider: "OpenAI", free: true },

  // Kimi
  { id: "kimi/kimi-k2.5", name: "Kimi K2.5", provider: "Kimi", free: true },
  { id: "kimi/k2.6-fast", name: "Kimi K2.6 Fast", provider: "Kimi", free: true },
  { id: "kimi/kimi-k2.6", name: "Kimi K2.6", provider: "Kimi", free: true },
  { id: "kimi/k2.6-normal", name: "Kimi K2.6 Normal", provider: "Kimi", free: true },
  { id: "kimi/k2.7-code-fast", name: "Kimi K2.7 Code Fast", provider: "Kimi", free: true },
  { id: "kimi/k2.7-code-normal", name: "Kimi K2.7 Code Normal", provider: "Kimi", free: true },

  // Llama
  { id: "meta-llama/l3.3-70b-fast", name: "Llama 3.3 70B Fast", provider: "Meta", free: true },
  { id: "meta-llama/l3.3-70b-normal", name: "Llama 3.3 70B Normal", provider: "Meta", free: true },
  { id: "meta-llama/l4-maverick", name: "Llama 4 Maverick", provider: "Meta", free: true },

  // Mistral
  { id: "mistral/m2.7-fast", name: "Mistral 2.7 Fast", provider: "Mistral", free: true },
  { id: "mistral/m2.7-normal", name: "Mistral 2.7 Normal", provider: "Mistral", free: true },
  { id: "mistral/m3-fast", name: "Mistral 3 Fast", provider: "Mistral", free: true },
  { id: "mistral/m3-normal", name: "Mistral 3 Normal", provider: "Mistral", free: true },

  // Mimo
  { id: "mimo/mimo-v2.5", name: "Mimo v2.5", provider: "Mimo", free: true },
  { id: "mimo/mimo-v2.5-pro", name: "Mimo v2.5 Pro", provider: "Mimo", free: false },

  // MiniMax
  { id: "minimax/minimax-m2.5", name: "MiniMax M2.5", provider: "MiniMax", free: true },

  // NVIDIA
  { id: "nvidia/nvidia-nemotron-3-super-120b", name: "Nemotron 3 Super 120B", provider: "NVIDIA", free: true },

  // Qwen
  { id: "qwen/qwen3.5-397b-a17b", name: "Qwen 3.5 397B-A17B", provider: "Qwen", free: true },

  // Tiny
  { id: "tiny/tiny-normal", name: "Tiny Normal", provider: "Tiny", free: true },
];

export const defaultModel = models[0].id;
