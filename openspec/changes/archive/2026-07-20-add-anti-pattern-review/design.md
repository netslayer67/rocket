## Context

`NarrativesService` already owns generation, deterministic review, and manual approval. Its reviewer only detects sales wording, so generic AI framing can reach the queue and be approved.

## Goals / Non-Goals

**Goals:**

- Keep a small, deterministic library of prohibited generic phrasing.
- Add the same rules to the generation prompt and review every returned draft.
- Retry one live generation when a prohibited pattern is found, then block approval if it remains.

**Non-Goals:**

- No style imitation, scoring schema, model fine-tuning, database migration, or unlimited retry loop.

## Decisions

- Put regex checks and prompt guidance in one narrative-local helper. This avoids a database-backed library before creators need to manage custom rules.
- Use one rewrite through `AiOrchestratorService`; a second matching result remains visible with a blocking reviewer note. One retry limits free-model tokens and prevents loops.
- Derive the blocking state from the existing reviewer note in the UI and enforce it again in the approval service. The server remains the trust boundary.

## Risks / Trade-offs

- [Regexes can flag intentional contrast] → The creator can change the topic and regenerate; rules intentionally favor avoiding this overused pattern.
- [A free model can repeat a prohibited phrase] → The second result stays a draft and cannot be approved.
