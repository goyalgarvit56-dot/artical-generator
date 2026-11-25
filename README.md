# Gemini News Article Generator (Vercel)

Enter a topic, click one button, and get a short news article written by Google Gemini.
The API key stays on the server (Vercel) and is never sent to the browser.

## Important: Gemini Pro subscription vs API key

A Gemini Pro or Google AI Pro subscription (the one you use in the Gemini app) usually does NOT
include API access. You need a separate Gemini API key from Google AI Studio
(https://aistudio.google.com/apikey). There is a free tier with limits; paid usage is billed separately by Google.

## Deploy on Vercel

1. Put these files in a GitHub repository (github.com, New repository, Upload files).
   Upload the contents of this folder: api, public, config.js, package.json, vercel.json.
2. On vercel.com, click Add New, Project, import that repository.
3. Before clicking Deploy, open Environment Variables and add:
   Name: GEMINI_API_KEY   Value: your key
4. Click Deploy. When it finishes, open the link Vercel gives you.
5. If you add or change the key later, go to Deployments and Redeploy so the change is picked up.

## Things you can edit (all in config.js)

- GEMINI_MODEL: Gemini model name. Default is gemini-2.5-flash.
- FIXED_PROMPT: the article prompt. [topic] is replaced with what you type.

## Files

- api/generate.js   Backend that calls Gemini using GEMINI_API_KEY
- config.js         Model name and fixed prompt
- public/index.html The webpage
- vercel.json       Gives the backend up to 60 seconds to answer
- package.json      Project info
