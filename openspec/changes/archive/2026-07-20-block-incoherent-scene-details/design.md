## Context

`apps/api` already runs one deterministic reviewer before and after one bounded AI rewrite. The reviewer currently catches generic phrasing, impersonal voice, headline style, and an unbridged reference, but not incompatible concrete scene details. No schema or API contract changes are needed.

## Goals / Non-Goals

**Goals:**

- Block the reported kite/floor scene mismatch and request the existing one rewrite.
- Tell the generator not to invent unrelated concrete scenes.
- Keep the solution small, deterministic, and testable.

**Non-Goals:**

- General-purpose semantic reasoning, an additional LLM review, an NLP dependency, or a broad keyword blacklist.

## Decisions

- Add one observed incompatible-scene pair to `narrative-review.ts`, the shared gate used by generation, list, and approval. A generic semantic classifier was rejected because it would add cost and false certainty without enough examples.
- Add a concise no-invented-scene instruction to generation and rewrite prompts. The existing rewrite path is reused; no extra model request is introduced.
- Write a unit test for the faulty sentence and its blocking result.

## Risks / Trade-offs

- [A narrow pair cannot detect every incoherent draft] → it stops the observed defect without pretending to understand all language; add a pair only after a reviewed failure.
- [A valid unusual scene could be flagged] → the pair is limited to the exact unexplained kite/floor combination and remains a manual-review blocker, not an automatic deletion.

## Migration Plan

Deploy the reviewer and prompt update. Existing drafts are re-evaluated through the current list/approval flow; rollback removes the pair and prompt sentence. No database migration is required.

## Open Questions

- Collect reviewed failures before deciding whether a future semantic evaluator is justified.
