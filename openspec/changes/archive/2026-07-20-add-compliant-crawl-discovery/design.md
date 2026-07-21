## Context

The API already accepts a one-time `POST /knowledge/import` request, asks `AiOrchestratorService` to extract a pattern, and stores only metadata. This change adds public-web acquisition without creating a second extraction path, a crawler database, or dashboard automation.

Affected apps and contracts: `apps/crawler` is a standalone Python CLI; `apps/api` keeps the existing import contract; MongoDB `knowledge` and Qdrant payloads remain unchanged; `apps/web` receives no crawler trigger in V1.

## Goals / Non-Goals

**Goals:**

- Let an operator explicitly crawl a public HTTP(S) seed with Scrapy and submit bounded transient text to the existing API.
- Offer an optional Nutch discovery command that returns same-domain candidate URLs without importing them.
- Enforce robots, a polite request rate, domain bounds, public-target checks, temporary artifacts, and metadata-only retention.

**Non-Goals:**

- Authenticated crawling, bypassing access controls, social-network scraping, bulk crawling, scheduling, dashboard execution, direct LLM calls, new collections, or auto-publishing.

## Decisions

- **Scrapy is the importer.** Its standard crawler settings provide robots enforcement, one request per domain, AutoThrottle, timeout, and page limit. It posts to `/knowledge/import` using Python's standard library. This reuses validation and the only approved AI path. A Nest endpoint that executes crawl commands was rejected because it would create a remote process-execution surface.
- **Nutch is discovery-only and operator-run.** A short Bash adapter runs an existing Nutch runtime with an isolated, deleted-on-exit work directory and a seed-specific URL filter. Nutch is not embedded in the API because its crawl database contains raw fetched artifacts and does not fit the lightweight V1 request flow.
- **The crawler uses explicit input and safe defaults.** It accepts only public HTTP(S) seeds, rejects loopback/private/reserved resolved addresses, starts at one page, and follows links only when the operator explicitly raises the page cap. It remains same-domain.
- **No new UI or schema.** Imported page text stays in process memory only. Existing `knowledge` metadata and Qdrant vectors remain the durable learning memory.

## Risks / Trade-offs

- [DNS rebinding or proxy routing can evade a simple preflight] → DNS is validated before crawl; deployment must also use outbound network policy for stronger isolation.
- [Nutch setup is heavier than Scrapy] → it is optional, documented as manual discovery, and never required for V1 imports.
- [Public pages can be noisy or wrong] → the creator chooses seeds, existing pattern reviewer/evaluation remains in the loop, and no result publishes automatically.
- [Remote pages can be large] → response size, page count, timeout, concurrency, and delay are bounded.

## Migration Plan

1. Install the Scrapy requirements in the crawler virtual environment and configure crawler environment values.
2. Start the existing API and run the manual crawler against an approved public URL.
3. Optionally prepare a Nutch runtime and run the discovery script in Bash/WSL.
4. Roll back by deleting `apps/crawler` or ceasing CLI use; no database migration or API rollback is needed.

## Open Questions

- A future V3 discovery queue needs a separate review queue and stronger egress isolation before it can be automated.
