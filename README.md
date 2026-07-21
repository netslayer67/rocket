# Rocket Project

V2 is a local-first AI Narrative Engine: persona management, pattern-only knowledge import, Qdrant semantic retrieval, narrative generation, and manual copy/publish.

## Run

1. Copy `apps/api/.env.example` to `apps/api/.env` and add an OpenRouter key if you want live generation. Without one, the generator deliberately uses a local demo response.
2. Run `docker compose up -d` to start MongoDB and Qdrant.
3. Ensure at least 2 GB of free disk space, then run `npm install`.
4. Run `npm run dev:api`, then `npm run dev` in another terminal.
5. Open `http://localhost:3000`.

The API starts at `http://localhost:4000`. V2 does not publish to any external platform; the generated narrative is copied manually for approval.

## Optional compliant discovery

[apps/crawler](apps/crawler/README.md) contains the V1 manual crawler tools. Scrapy can import a creator-selected public page through the existing knowledge API; it obeys robots.txt, limits requests, and retains no raw page text. Apache Nutch is an optional Bash/WSL command for same-domain URL discovery only. Neither tool is available from the dashboard, scheduled, or connected to publishing.

## Optional Threads connection

Create a Meta App with the Threads use case, register the exact `THREADS_REDIRECT_URI`, then set `THREADS_APP_ID`, `THREADS_APP_SECRET`, and a base64 32-byte `THREADS_TOKEN_ENCRYPTION_KEY` in `apps/api/.env`. The dashboard then sends the creator to the official Threads authorization screen. Rocket Project never accepts a Threads email or password, and connection alone cannot publish content.

After upgrading existing V1 data, use **Reindex semantic search** in Knowledge Library or `POST /knowledge/reindex`. If Qdrant or the embedding model is unavailable, import and generation still use the lexical fallback.

## Development rules

Read [AGENTS.md](AGENTS.md) and the documents in [context](context) before a meaningful change. Use the local OpenSpec skills for proposal → implementation → sync → archive; Ponytail keeps the implementation minimal and safe.

```text
npm run check:lines
npm test
npm run build
```

Source-code files are limited to 200 lines. The checker covers `apps/` and `scripts/`. The environment template lists Qdrant and embedding-model settings in [apps/api/.env.example](apps/api/.env.example).
