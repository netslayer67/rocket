## Context

`NarrativeReviewService` is deterministic and already checks generic contrast, human voice, link bridges, and the known kite/floor failure. The two new evaluations add reusable evidence: the neon-shoe draft has context drift and abstract AI smell; the community-shoe draft shows stronger hooks but reaches conclusions too quickly. V1 must improve with small heuristics and compact knowledge metadata, not a new agent or dependency.

## Goals / Non-Goals

**Goals:**

- Detect obvious scene/object/activity mismatches before approval.
- Prefer concrete sensory observations and visible uncertainty over polished summaries.
- Preserve positive DNA as prompt context and negative DNA as constraints.
- Keep all LLM calls behind `AiOrchestratorService`, Mongo metadata-only, and files below 200 lines.

**Non-Goals:**

- No full semantic world model, external classifier, or chain-of-thought storage.
- No automatic publishing or replacement of manual approval.
- No new UI surface or dependency.

## Decisions

1. Extend the existing reviewer with a small lexicon of high-confidence incompatible scene groups and anti-pattern phrases. A deterministic guard is cheaper and observable; an LLM scene agent would add latency and an unbounded failure mode.
2. Add one process-of-thought gate using existing first-person and curiosity cues (`awalnya`, `gw kira`, `jangan-jangan`, `makin dipikir`, `belum yakin`, `baru kepikiran`). It checks for visible thinking without persisting private reasoning.
3. Keep DNA in the existing `Knowledge` shape. Positive lessons use naturalness 4–5 and `patternSummary`; negative lessons use `sourceLabel` starting with `Negative lesson`, naturalness 1–2, and explicit anti-pattern fields. `patternContext` already sends these fields to generation.
4. Reuse the one-time rewrite path. Reviewer notes become the repair contract; no second reviewer service is introduced.

## Risks / Trade-offs

- [Risk] Lexical scene checks can miss metaphor or flag a deliberate comparison → require a bridge cue (`mirip`, `analogi`, `ingat`, `bandingkan`) before allowing cross-scene references; future learning can replace the lexicon with evaluated classifiers.
- [Risk] A process cue can be absent from an excellent terse draft → keep the check blocking only when no concrete curiosity cue exists, and allow an explicit first-person observation to satisfy it.
- [Risk] Qdrant may be unavailable → Mongo import remains successful with `vectorStatus: pending`; reindex is recoverable.

## Migration Plan

Add reviewer rules and tests, insert the two compact lessons idempotently, run the existing reindex endpoint, deploy the API, and archive this change. Rollback is a single code revert; metadata records are harmless constraints and can be removed by `sourceLabel` if needed.

## Open Questions

None for V1. A trained scene classifier can be evaluated after enough reviewed drafts exist.
