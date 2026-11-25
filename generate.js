// Gemini News Article Generator - backend (Vercel serverless function)
// The API key is read from the GEMINI_API_KEY environment variable and
// is never sent to the browser.

const { GEMINI_MODEL, FIXED_PROMPT } = require("../config");

const MAX_TOPIC_LENGTH = 200;

// Turns Gemini error responses into messages a beginner can act on.
function friendlyGeminiError(status, apiMessage) {
  if (status === 400 && /API key/i.test(apiMessage || "")) {
    return "Gemini rejected the API key. Check GEMINI_API_KEY in Vercel Environment Variables.";
  }
  if (status === 400) return "Gemini could not process this request. " + (apiMessage || "");
  if (status === 401 || status === 403) {
    return "Gemini says this API key is not allowed. Check the key, and make sure the Gemini API is enabled for it.";
  }
  if (status === 404) {
    return "Gemini could not find the model " + GEMINI_MODEL + ". Change the model name in config.js.";
  }
  if (status === 429) {
    return "Gemini rate or quota limit reached. Wait a minute and try again, or check your quota in Google AI Studio.";
  }
  if (status >= 500) return "Gemini is having trouble right now. Please try again in a moment.";
  return "Gemini returned an error (" + status + "). " + (apiMessage || "");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use the Generate Article button on the page." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not set. Add it in Vercel under Settings, Environment Variables, then redeploy."
    });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const topic = String((body && body.topic) || "").trim();

  if (!topic) return res.status(400).json({ error: "Please enter a topic first." });
  if (topic.length > MAX_TOPIC_LENGTH) {
    return res.status(400).json({ error: "Topic is too long. Keep it under " + MAX_TOPIC_LENGTH + " characters." });
  }

  // Insert the topic wherever [topic] appears (split/join avoids special-character surprises).
  const prompt = FIXED_PROMPT.split("[topic]").join(topic);

  const url = "https://generativelanguage.googleapis.com/v1beta/models/" +
    encodeURIComponent(GEMINI_MODEL) + ":generateContent";

  try {
    const geminiRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await geminiRes.json().catch(() => ({}));

    if (!geminiRes.ok) {
      const apiMessage = data && data.error && data.error.message;
      console.error("Gemini error:", geminiRes.status, apiMessage);
      return res.status(502).json({ error: friendlyGeminiError(geminiRes.status, apiMessage) });
    }

    if (data.promptFeedback && data.promptFeedback.blockReason) {
      return res.status(422).json({ error: "Gemini blocked this topic (" + data.promptFeedback.blockReason + "). Try a different topic." });
    }

    const parts = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
    const article = (parts || []).map((p) => p.text || "").join("").trim();

    if (!article) {
      return res.status(502).json({ error: "Gemini returned an empty response. Please try again or try a different topic." });
    }

    return res.status(200).json({ article, model: GEMINI_MODEL });
  } catch (err) {
    console.error("Network error:", err);
    return res.status(502).json({ error: "Could not reach Gemini. Please try again." });
  }
};
