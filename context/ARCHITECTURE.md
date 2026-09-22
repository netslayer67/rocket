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

1. A user creates or updates one active persona. Legacy personas are archived for history; new drafts cannot select them.
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
15. The Railway API autonomously checks approved evidence for the active persona every five minutes without browser traffic. At most six records of each source type enter one fingerprinted batch. A free model synthesizes one diagnosis; a second free-model call checks grounding, novelty and context. Accepted metadata is saved once with source IDs and reused by that persona's retrieval, with a provisional-synthesis caveat in narrative prompts. Drafts, raw imported bodies, archived-persona records, unscoped legacy DNA, autonomous DNA inputs, publishing, and analytics candidates are excluded.

## Autonomous learning operations

`AutonomousLearningService` lives in the existing feedback module, not a separate service or queue. It is enabled by default when `RAILWAY_ENVIRONMENT_ID` exists (and not Vercel), otherwise requires `AUTONOMOUS_LEARNING_ENABLED=true`. Explicit `false` is the kill switch. Keep **one API replica** and Railway sleeping disabled; the in-process overlap guard and daily quota are not distributed scheduling guarantees.

Durable `LearningCycle` claims allow at most four attempts per UTC day, two per evidence fingerprint per day, with fifteen-minute failure backoff. Unchanged completed/rejected batches are skipped; failed batches can retry the next day. Abandoned stages are marked failed after fifteen minutes, and a lesson saved before interruption is recovered by its unique key without another AI call. The recent-six window is a coverage ceiling, not a full-corpus learning claim.

All autonomous completions and embeddings are free-only (zero-price provider routing, at most three chat fallbacks, 30-second model timeouts). Internal evidence never uses OpenRouter's dynamic `openrouter/free` router: the reviewed structured-output fallbacks are Nemotron 3 Super, Nex N2.5 Mini, and Nex N2.5 Pro, in configurable order. Paid embedding configuration leaves the index pending. A single attempt can make at most six chat requests and one embedding request; four attempts cap this path at 28 requests/day, separate from interactive API usage. Model agreement is not empirical quality evaluation or weight training. There is no claim of perfection or guaranteed growth on unchanged data.

`GET /monitoring/history` and read-only SSE expose `learning.enabled`, phase, reason, last/next check, bounded input count, daily attempts and latest durable result. A heartbeat means connection health only. Last/next check are process-local timestamps, while attempts and outcomes survive restarts.

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
- New knowledge and learning evidence are scoped to the active persona. Legacy unscoped metadata is retained but cannot influence new generation.
- Outcome promotion must be explicitly approved, typed positive/negative, idempotent, and linked back to its narrative.
- Outcome candidates are provisional observations; they never create DNA without explicit approved feedback.
- Crawler pages obey robots.txt, stay bounded to a public seed domain, and never persist raw fetched text or Nutch artifacts.

## Deferred architecture

BullMQ/Redis queues, distributed durable scheduling, platform analytics ingestion, replies, token refresh jobs, and trend analysis remain deferred. V1 job replay is Mongo-backed but intentionally lacks queue semantics. Internal-learning attempts are durable but scheduling and daily-cap coordination remain single-process. Analytics are manual capture. Automated crawling needs a reviewed queue and stronger network isolation before it can be considered.
