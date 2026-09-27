## Context

`AiOrchestratorService` tries named persona models sequentially, but failed HTTP responses are discarded except for the last generic status. `AiRun` already stores compact accepted/rejected model attempts and bounded retrieval metadata. `KnowledgeService` already performs Qdrant search before Mongo fallback, but its metadata cannot say whether the semantic read was reached.

## Goals / Non-Goals

**Goals:**

- Record a safe HTTP-class outcome for every failed configured candidate and keep trying the remaining candidates.
- Persist whether a semantic Qdrant read completed, then use that signal in monitoring.
- Explain the outcome in the existing timeline and activate Qdrant only for an actual completed semantic read.

**Non-Goals:**

- No provider response body, prompt, source, draft, credential, request URL, or error stack is persisted or rendered.
- No model discovery request, model-list cache, automatic configuration rewrite, retries beyond the existing candidate list, or Qdrant write during generation.
- No change to the manual approval or free-only policy.

## Decisions

1. Reuse `AiRun.rejection` with a small safe code (`http-404`, `http-429`, `http-5xx`, `request-error`) for failed candidates. This reuses the current telemetry and timeline rather than adding a failure collection.
2. Add `semanticQueried` to bounded retrieval metadata. It is true only when `VectorIndexService.searchWithStatus` returned without its fallback failure. It says a query completed, not that a semantic match existed.
3. Monitoring projects only `retrievalMode`, counts, and `semanticQueried`; knowledge IDs remain absent. The map activates Qdrant from `semanticQueried`, and the existing timeline appends a safe rejection code.

## Risks / Trade-offs

- [A 404 can still have several upstream causes] → retain only the factual HTTP code and do not overstate root cause.
- [Failed candidates add up to four AiRun documents per job] → the existing candidate cap bounds writes; these records make fallback auditable.
- [Qdrant can return no matches] → `semanticQueried` still lights Qdrant because the read occurred; match count remains separately available.

## Migration Plan

Deploy with optional fields. Existing AiRun records simply omit the added retrieval flag and rejection codes. Rollback ignores the optional fields; no data migration is necessary.

## Open Questions

None. Provider-specific availability can only be resolved with the safe code plus the operator's OpenRouter account settings.
