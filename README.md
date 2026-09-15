# DISCIPLES

A public-ready Next.js web game where a player debates a dynamically generated AI atheist and tries to convert it.

## Run locally
1. Install Node.js 18+.
2. `npm install`
3. Copy `.env.example` to `.env.local`
4. Add your OpenAI API key.
5. `npm run dev`
6. Open http://localhost:3000

## Deploy publicly
The easiest route is Vercel:
1. Put this folder in a GitHub repository.
2. Import the repository into Vercel.
3. Add `OPENAI_API_KEY` as an environment variable.
4. Deploy.

The API key is only used server-side in `/app/api/debate/route.js`; it is not exposed to the browser.

## Notes
The atheist is intentionally one consistent character, but responses are generated dynamically from the full debate history, so conversations won't be fixed.
