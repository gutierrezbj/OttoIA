// Thin wrapper around Gemini REST API (no SDK dependency)
// Uses native fetch (Node 20+)

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

/**
 * Call Gemini with a system prompt + chat history.
 * @param {Object} opts
 * @param {string} opts.system - system instruction
 * @param {Array<{role:'user'|'assistant', content:string}>} opts.messages - chat history
 * @param {number} [opts.maxTokens=400]
 * @param {number} [opts.temperature=0.7]
 * @returns {Promise<string>} assistant text
 */
async function generate({ system, messages, maxTokens = 400, temperature = 0.7 }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  const body = {
    system_instruction: { parts: [{ text: system }] },
    contents,
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature
    }
  };

  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini empty response: ' + JSON.stringify(data).slice(0, 300));
  return text;
}

module.exports = { generate };
