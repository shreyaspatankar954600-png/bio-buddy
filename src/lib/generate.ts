// Shared client helper to call our backend /api/generate proxy.
// In the Lovable preview (no serverless backend) we surface a friendly error.

export interface GenerateOptions {
  messages: any[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: "json_object" };
}

export async function callGenerate(opts: GenerateOptions): Promise<string> {
  let res: Response;
  try {
    res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(opts),
    });
  } catch {
    throw new Error("Network error reaching the generation service.");
  }

  if (res.status === 404) {
    throw new Error(
      "Generation service unavailable in this preview. Deploy to Vercel with GROQ_KEY_* env vars to enable."
    );
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Service error (${res.status}).`);
  }

  if (!res.ok) {
    throw new Error(data?.error || `Service error (${res.status}).`);
  }

  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from the AI service.");
  return text;
}
