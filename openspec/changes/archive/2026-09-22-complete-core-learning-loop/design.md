## Context

The Next.js studio already guides a creator through profile, knowledge, generation, review, and manual approval. NestJS retrieval logs compact metadata in `AiRun`, while the saved `Narrative` only keeps reviewer notes. The Railway learner consolidates approved active-persona evidence, but its durable cycle cannot report the quality of narrative evidence that informed a synthesis.

## Goals / Non-Goals

**Goals:**

- Store a bounded retrieval trace and deterministic quality snapshot with each new draft.
- Evaluate persona consistency, specificity, stereotype risk, and hidden-selling risk from the existing reviewer evidence.
- Pass only compact quality data into eligible internal-learning evidence and expose its aggregate in monitoring.
- Show the same data in the existing review card with accessible, responsive text.

**Non-Goals:**

- Fine-tuning, automatic edits, automatic approval or publishing, causal effectiveness claims, raw-source retention, model calls solely for scoring, queues, or new dependencies.

## Decisions

- **Use deterministic review diagnostics as the quality source.** A small pure evaluator translates current diagnostic codes into four named dimensions and a pass/fail result. This is reproducible and free; a third model call would add cost and unverifiable judgment.
- **Snapshot retrieval on `Narrative`.** The generation service already has compact mode/count/ID metadata. Copying that bounded object to the saved draft lets the studio explain the actual context without joining secret prompts or `AiRun` records.
- **Keep learning quality observational.** Approved narrative evidence includes its stored quality snapshot; each cycle records only eligible-draft count and average score. The learner does not infer causation or mutate a draft.
- **Use the existing review card and monitoring event.** No new screen, agent, service, or UI library is justified for two compact status blocks.

## Risks / Trade-offs

- [Heuristic false positives] → Scores explain their diagnostic basis and manual approval remains authoritative.
- [Legacy drafts lack snapshots] → List responses derive a current snapshot without rewriting old records.
- [Quality number is mistaken for performance] → UI and monitoring call it a draft gate, never an outcome metric.
- [New stereotype check is too broad] → Keep it to explicit group generalizations with a Ponytail threshold before expansion.

## Migration Plan

1. Deploy additive Mongo fields; existing drafts remain valid.
2. New drafts receive snapshots; older drafts calculate a display-only snapshot on read.
3. Railway cycles retain optional quality aggregates and remain safe to roll back because all new fields are optional.

## Open Questions

None. Future platform-outcome evaluation remains part of advanced operations, not this change.
