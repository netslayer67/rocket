## Context

`NarrativesService` already performs deterministic review after generation, makes one bounded rewrite attempt, persists reviewer diagnostics, and blocks manual approval on any blocking result. It also passes a stricter `narrativeOutputGate` to `AiOrchestratorService`, so every model must be fully review-clean before that recovery path can start. Production evidence shows parseable models rejected as `voice-quality` and another rejected as `invalid-output`; after the four-candidate bound, the job ends without a draft.

The Qdrant warning is unrelated: `VectorIndexService.searchWithStatus` returns `{ failed: true }`, and `KnowledgeService` continues with lexical/recent fallback.

## Goals / Non-Goals

**Goals:**

- Reject malformed model answers early and try the next named free model.
- Let an otherwise parseable draft reach the existing reviewer/rewrite/manual-approval path.
- Preserve all blocking diagnostics and never publish a draft automatically.

**Non-Goals:**

- Hide reviewer failures, accept unparseable text, add retries or models, alter Qdrant configuration, or claim the draft has passed quality review.

## Decisions

1. Add a shape-only narrative output gate next to the existing strict gate. It calls the same parser and returns `invalid-output` only when title, body, or link placement cannot be extracted. Generation and rewrite use this gate; the strict gate remains an explicit testable quality classifier.
2. Retain the full deterministic review after parsing. Existing `rewriteWeakDraft` receives its diagnostic list, tries once, and the saved draft records the final quality snapshot. Manual approval remains blocked for unresolved diagnostics.
3. Do not change vector retrieval. The current status-aware fallback already meets the intended failure mode; changing it would be unrelated scope expansion.

## Risks / Trade-offs

- [A lower-quality parseable draft reaches review] -> It is labelled with diagnostics and cannot be approved or published until a person corrects/regenerates it.
- [The first usable model is weaker than a later candidate] -> One rewrite remains bounded; prioritizing availability prevents all-candidate failure. A quality-ranked multi-candidate selector would require retaining candidate bodies and is deliberately deferred.
- [Malformed answers still occur] -> The shape gate rejects them and uses only the existing bounded fallback list.

## Migration Plan

Deploy API changes through the existing Railway GitHub integration. Verify a known failing topic creates a draft or a clear error only when no candidate is parseable; verify a reviewer-blocked draft cannot be approved. Rollback is a single commit and needs no data migration.

## Open Questions

None.
