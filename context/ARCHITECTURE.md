# Architecture

## Current boundary: V1 completion with V2 Knowledge Engine

Rocket Project is a monorepo with a Next.js dashboard and a NestJS API. V2 adds semantic pattern retrieval to the V1 persona, narrative, logging, and manual-approval flow. It does not publish content automatically.

```text
Next.js dashboard
        │ HTTP
        ▼
NestJS API ──► MongoDB (pattern, feedback, analytics metadata)
        │                  ▲
        ▼                  │
AI Orchestrator ──► OpenRouter embeddings
        │
        ▼
Qdrant (semantic vector index)

Next.js dashboard ◄── SSE narrative job events ── NestJS API

NestJS API ──► Threads OAuth + approved text publish

Scrapy CLI ──► NestJS API (manual transient import)
Nutch CLI ──► candidate URLs only (manual operator review)
```

## Responsibilities

| Layer | Responsibility |
| --- | --- |
| `apps/web` | User input, review, and manual approval UI. No model calls. |
| `apps/api` | Validation, domain services, persistence, and API endpoints. |
| `ai` module | Prompt construction, chat fallback, embedding cache, and telemetry. |
| MongoDB | Personas, pattern metadata, narrative drafts, compact SSE job events, and AI run metadata. |
| Qdrant | Vector plus Mongo knowledge ID only; never the imported source. |
| `threads` module | OAuth state, encrypted token persistence, and connection status; never publishing. |
| `apps/crawler` | Manual public-page acquisition with Scrapy and optional Nutch candidate discovery; no dashboard or API process execution. |

## Core flow

1. A user creates a persona.
2. A source thread is submitted once for extraction; the raw body is not persisted.
3. A compact metadata document is embedded through the orchestrator and indexed in Qdrant.
4. Knowledge retrieval merges bounded semantic matches with lexical topic matches, deduplicates Mongo IDs, and uses recent patterns only when both query paths are empty.
5. A creator can optionally request a transient public-link preview that returns bounded title/description plus optional type, site, author, section, date, price, currency, and canonical metadata; the AI Orchestrator turns it into an editable recommended angle plus alternatives.
6. `NarrativesService` asks only `AiOrchestratorService` to generate a draft.
7. The API persists a compact job record and returns a job ID. The SSE request replays `queued`, claims the job once, emits progress over `GET /narratives/events?jobId=...`, persists the draft, then emits `complete` with the saved draft. This works across Vercel function instances without adding a queue.
8. Deterministic checks flag missing contextual references, promotional phrasing, generic AI patterns, article-style hooks, absent persona voice, and observed incompatible concrete scenes; list responses add stable diagnosis codes and one live rewrite is bounded through the orchestrator.
9. The user reviews and approves the draft before copying it to a platform.
10. A creator can connect one Threads account through Meta OAuth; only an approved draft can invoke the explicit text publisher.
11. An operator can record structured feedback; approved feedback becomes diagnosis-first knowledge and can be rerun safely.
12. An operator can enter observed metrics to derive CTR and engagement; a read-only insights endpoint groups bounded rows into manual outcome candidates, and an explicit approval endpoint promotes one candidate through KnowledgeService into diagnosis-first DNA. No automatic promotion or causal claim is made.
13. An operator can manually crawl a creator-selected public URL with Scrapy; its transient text enters the existing knowledge-import flow.
14. An operator can manually run Nutch to discover bounded same-domain URLs, then individually choose a URL for Scrapy import.

## Invariants

- Domain services never call OpenRouter directly.
- A link is a reference, not a hard-selling CTA.
- Imported source text is transient; only pattern metadata is stored.
- Reference-preview HTML is transient; only creator-selected narrative fields are stored.
- A narrative stays `draft` until a person approves it; publishing is a separate explicit action.
- The SSE `complete` event is emitted only after the draft is persisted; job payload/events are compact, Mongo-backed, and bounded.
- AI model, caching, token usage, and compact retrieval mode/IDs are logged in `AiRun`; prompts, vectors, and source text are excluded.
- A failed semantic index marks a record `pending`; it never blocks metadata import.
- Threads email, password, and plaintext access tokens are never persisted or returned by the API.
- Feedback must be explicitly approved for learning; a learning run never publishes content.
- Outcome promotion must be explicitly approved, typed positive/negative, idempotent, and linked back to its narrative.
- Outcome candidates are provisional observations; they never create DNA without explicit approved feedback.
- Crawler pages obey robots.txt, stay bounded to a public seed domain, and never persist raw fetched text or Nutch artifacts.

## Deferred architecture

BullMQ/Redis queues, durable retries/scheduling, platform analytics ingestion, replies, token refresh jobs, and trend analysis belong to V2–V5. V1 job replay is Mongo-backed but intentionally lacks queue semantics. V1 analytics are manual capture and its learning timer is single-process only. Automated crawling needs a reviewed queue and stronger network isolation before it can be considered.
