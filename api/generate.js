// Vercel serverless function — proxies to Groq with multi-key failover.
// Add GROQ_KEY_1, GROQ_KEY_2, GROQ_KEY_3, ... to Vercel env vars.

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Collect every GROQ_KEY_* env var, in numeric order, ignoring empties.
  const keys = Object.keys(process.env)
    .filter((k) => /^GROQ_KEY_\d+$/.test(k))
    .sort((a, b) => Number(a.split("_")[2]) - Number(b.split("_")[2]))
    .map((k) => process.env[k])
    .filter(Boolean);

  if (keys.length === 0) {
    return res
      .status(500)
      .json({ error: "No Groq API keys configured on the server." });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const payload = {
    model: body.model || "llama-3.1-8b-instant",
    messages: body.messages,
    temperature: body.temperature ?? 0.85,
    max_tokens: body.max_tokens ?? 1200,
    ...(body.response_format ? { response_format: body.response_format } : {}),
  };

  let lastErr = null;
  for (const key of keys) {
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(payload),
      });

      if (r.ok) {
        const data = await r.json();
        return res.status(200).json(data);
      }

      // 429 = rate limit, 401/403 = bad/expired key → try next key
      if (r.status === 429 || r.status === 401 || r.status === 403) {
        lastErr = `Key failed (${r.status})`;
        continue;
      }

      // Other errors (e.g. 400 bad request) — return immediately, not a key problem.
      const errData = await r.json().catch(() => null);
      return res.status(r.status).json({
        error: errData?.error?.message || `Groq error: ${r.status}`,
      });
    } catch (e) {
      lastErr = e?.message || "fetch failed";
      continue;
    }
  }

  return res.status(503).json({
    error: "Service busy, try again shortly.",
    detail: lastErr,
  });
}
