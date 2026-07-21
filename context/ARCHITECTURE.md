# Architecture

## Current boundary: V2 Knowledge Engine with Threads connection

Rocket Project is a monorepo with a Next.js dashboard and a NestJS API. V2 adds semantic pattern retrieval to the V1 persona, narrative, logging, and manual-approval flow. It does not publish content automatically.

```text
Next.js dashboard
        │ HTTP
        ▼
NestJS API ──► MongoDB (pattern metadata)
        │                  ▲
        ▼                  │
AI Orchestrator ──► OpenRouter embeddings
        │
        ▼
Qdrant (semantic vector index)

Next.js dashboard ◄── SSE narrative job events ── NestJS API

NestJS API ──► Threads OAuth (connection only)

Scrapy CLI ──► NestJS API (manual transient import)
Nutch CLI ──► candidate URLs only (manual operator review)
```

## Responsibilities

| Layer | Responsibility |
| --- | --- |
| `apps/web` | User input, review, and manual approval UI. No model calls. |
| `apps/api` | Validation, domain services, persistence, and API endpoints. |
| `ai` module | Prompt construction, chat fallback, embedding cache, and telemetry. |
| MongoDB | Personas, pattern metadata, narrative drafts, and AI run metadata. |
| Qdrant | Vector plus Mongo knowledge ID only; never the imported source. |
| `threads` module | OAuth state, encrypted token persistence, and connection status; never publishing. |
| `apps/crawler` | Manual public-page acquisition with Scrapy and optional Nutch candidate discovery; no dashboard or API process execution. |

## Core flow

1. A user creates a persona.
2. A source thread is submitted once for extraction; the raw body is not persisted.
3. A compact metadata document is embedded through the orchestrator and indexed in Qdrant.
4. Knowledge retrieval selects semantic matches, then falls back to lexical patterns.
5. A creator can optionally request a transient public-link preview that returns metadata and an editable topic suggestion through the AI Orchestrator.
6. `NarrativesService` asks only `AiOrchestratorService` to generate a draft.
7. Generation runs as an in-process job. The API returns a job ID, emits progress over SSE, persists the draft, then emits `complete` with the saved draft.
8. Deterministic checks flag missing contextual references, promotional phrasing, generic AI patterns, article-style hooks, absent persona voice, and observed incompatible concrete scenes; one live rewrite is bounded through the orchestrator.
9. The user reviews and approves the draft before copying it to a platform.
10. A creator can optionally connect one Threads account through Meta OAuth; this only prepares a future manual publisher.
11. An operator can manually crawl a creator-selected public URL with Scrapy; its transient text enters the existing knowledge-import flow.
12. An operator can manually run Nutch to discover bounded same-domain URLs, then individually choose a URL for Scrapy import.

## Invariants

- Domain services never call OpenRouter directly.
- A link is a reference, not a hard-selling CTA.
- Imported source text is transient; only pattern metadata is stored.
- Reference-preview HTML is transient; only creator-selected narrative fields are stored.
- A narrative stays `draft` until a person approves it.
- The SSE `complete` event is emitted only after the draft is persisted; job state is in-process and bounded.
- AI model, caching, and token usage are logged in `AiRun`.
- A failed semantic index marks a record `pending`; it never blocks metadata import.
- Threads email, password, and plaintext access tokens are never persisted or returned by the API.
- Crawler pages obey robots.txt, stay bounded to a public seed domain, and never persist raw fetched text or Nutch artifacts.

## Deferred architecture

BullMQ/Redis, durable multi-instance job recovery, analytics ingestion, publisher integrations, replies, token refresh jobs, and trend analysis belong to V3–V5. Automated crawling needs a reviewed queue and stronger network isolation before it can be considered.
