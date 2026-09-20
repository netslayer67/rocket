## Context

`apps/api` currently has approved-feedback conversion, an optional in-process timer, AI routing, knowledge indexing, and read-only SSE. `apps/web/monitoring` shows events but cannot explain an idle scheduler. The creator authorized approved internal sources and free models only.

## Goals / Non-Goals

**Goals:** browser-independent, bounded synthesis and validation of reusable internal lessons, durable provenance, honest scheduler visibility, and zero paid-model fallback.

**Non-Goals:** web acquisition, weight training, automated publishing, analytics promotion, claims of causal or guaranteed improvement, distributed workers.

## Decisions

- Reuse `FeedbackModule`, `AiOrchestratorService`, `KnowledgeService`, and monitoring. No dependency or queue. Activate by default only in Railway, with `AUTONOMOUS_LEARNING_ENABLED=false` as kill switch; local/serverless runs require explicit true.
- Check every five minutes (minimum one minute). Select at most six recent items per source: feedback approved for learning, non-autonomous DNA, and approved narratives. Compact bounded evidence stays transient. Autonomous outputs never feed themselves. Fingerprint the ordered input and policy revision; no unchanged-corpus regeneration.
- Permit four attempts per UTC day, two attempts per fingerprint per UTC day, with at least fifteen minutes before retry. Persist each unique fingerprint/day/attempt claim in a new `LearningCycle` schema before calling AI. Failed batches can recover on a later day when free providers return; completed and rejected batches are not repeated. One replica and an in-process lock bound concurrency; crash-abandoned attempts become failed after a bounded timeout rather than looping indefinitely. Recover partially saved lessons by their unique learning key before making any further model calls.
- Generate one positive or negative diagnosis with source IDs; a separate free-model request checks grounding, contradiction, novelty, and contextual usefulness. Reject missing fields, unsupported IDs, or failed checks. These are model-reviewed lessons, not measured improvement. No vocabulary blacklist or mandatory narrative sequence. Ponytail ceiling: two bounded model calls, deterministic shape/provenance checks; require a reviewed benchmark before stronger quality claims.
- Extend AI requests with `freeOnly`; filter configured chat models to `:free`/`openrouter/free`, bound fallbacks to three, require zero-price provider limits and timeouts, forbid demo fallback. Free-only embedding rejects a paid embedding configuration and leaves recoverable pending indexing.
- Knowledge gains autonomous origin, evidence IDs, and a sparse unique learning key. Retry after partial persistence reuses the same lesson. Cycle records contain IDs, hashes, phase, timestamps, model names, and fixed failure reasons, not source text or prompts.
- Extend `/monitoring/history` and SSE snapshots with scheduler status, last/next check, latest cycle, counts and limits. Emit initial snapshots and state transitions even with no historic events. UI exposes this information in text, preserving event-backed graph and accessible timeline.

## Risks / Trade-offs

- Free providers can rate-limit or disappear → bounded attempts, delayed retry, visible unavailable status, never paid fallback.
- Model agreement is not empirical evaluation → label provisional synthesis, retain provenance and source-specific caveats, do not promise perfection.
- Recent-window ceiling misses older material → disclose six-per-source scope; add cursor-based coverage only when required, not claim complete-corpus learning.
- Single replica cap is not a distributed quota → keep one Railway replica; distributed leasing/quota is required before scaling workers.
- Approval revoked while inference runs → re-read the evidence fingerprint immediately before saving and reject changed sources.

## Migration Plan

Additive schemas and contracts; existing clients tolerate new fields. Run unit tests, line checks, builds, UI review, then deploy API and web. Verify actual scheduler telemetry rather than health alone. Disable autonomous learning to roll back execution; existing DNA remains inspectable, no publishing behavior changes.

## Open Questions

None blocking implementation. Live provider availability and eligible internal source counts must be observed after deployment.
