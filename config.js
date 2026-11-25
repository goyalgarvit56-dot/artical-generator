// =====================================================================
//  SETTINGS YOU MAY WANT TO EDIT  (everything is in this one file)
// =====================================================================

// 1) GEMINI MODEL  -------------------------------------------------
// Change the model name here whenever you want to use a different one.
// Model list: https://ai.google.dev/gemini-api/docs/models
// (You can also override it by adding GEMINI_MODEL in Vercel Environment Variables.)
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

// 2) FIXED ARTICLE PROMPT  -----------------------------------------
// This is sent to Gemini every time. Only [topic] is replaced with
// whatever you type in the box. Edit the text between the backticks
// to change the prompt. Keep [topic] in it so your topic gets inserted.
const FIXED_PROMPT = `Write a breaking news type article minimum Words 200 and maximum words 250 if needed use very easy English language which is easy to understand for Indian readers and keep only under 1 heading try to keep it catchy on "[topic]" and provide accordingly meta description of it. Do not use any special characters like colon semicolon exclamation mark hashtag backslash or apostrophe. The title must be written so the first letter of every word is capital.`;

module.exports = { GEMINI_MODEL, FIXED_PROMPT };
