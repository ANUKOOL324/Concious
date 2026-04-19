import { InferenceClient } from "@huggingface/inference";
import {
  HF_API_KEY,
  HF_EMBEDDING_MODEL,
  OPENROUTER_API_KEY,
  OPENROUTER_MODEL,
} from "./config.js";

type EmbeddingMode = "query" | "document";

function formatE5Input(text: string, mode: EmbeddingMode) {
  const prefix = mode === "query" ? "query: " : "passage: ";
  return `${prefix}${text.trim()}`.slice(0, 2000);
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

const hfClient = HF_API_KEY ? new InferenceClient(HF_API_KEY) : null;

function normalizeEmbedding(payload: unknown): number[] {
  if (Array.isArray(payload) && payload.every((value) => typeof value === "number")) {
    return payload as number[];
  }

  if (
    Array.isArray(payload) &&
    payload.length > 0 &&
    Array.isArray(payload[0]) &&
    payload[0].every((value) => typeof value === "number")
  ) {
    return payload[0] as number[];
  }

  throw new Error("Unexpected embedding response format");
}

export async function getHfEmbedding(
  text: string,
  mode: EmbeddingMode = "document"
): Promise<number[] | null> {
  if (!hfClient || !text.trim()) {
    return null;
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const payload = (await hfClient.featureExtraction({
        model: HF_EMBEDDING_MODEL,
        inputs: formatE5Input(text, mode),
      })) as unknown;
      const embedding = normalizeEmbedding(payload);

      if (!embedding.length) {
        throw new Error("Received an empty embedding vector");
      }

      return embedding;
    } catch (error) {
      lastError = error;

      if (attempt < 2) {
        await wait(500 * (attempt + 1));
      }
    }
  }

  console.error("Embedding request failed", lastError);
  return null;
}

export async function askOpenRouter(
  userMessage: string,
  context: string
): Promise<string | null> {
  if (!OPENROUTER_API_KEY) {
    return null;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        temperature: 0.65,
        max_tokens: 220,
        messages: [
          {
            role: "system",
            content:
              "You are Ashqnor, a calm and practical assistant for CONCIOUS. Use the provided context when it is relevant, stay concise, and end with one gentle reflective question.",
          },
          {
            role: "user",
            content: `Question: ${userMessage}\n\nRelevant saved content:\n${context}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      throw new Error(`OpenRouter ${response.status}: ${details}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return payload.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error("OpenRouter request failed", error);
    return null;
  }
}
