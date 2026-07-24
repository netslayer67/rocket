## 1. Retrieval contract

- [x] 1.1 Define a compact retrieval result type containing records, mode, semantic count, lexical count, and matched IDs without raw text.
- [x] 1.2 Update `KnowledgeService.findRelevant` to merge bounded semantic and lexical candidates, deduplicate IDs, preserve deterministic order, and retain recent fallback behavior.
- [x] 1.3 Keep vector provider failures recoverable and expose the fallback mode to the narrative generation caller.

## 2. Observability and schema

- [x] 2.1 Add optional bounded retrieval metadata to the existing `AiRun` schema and its logging contract.
- [x] 2.2 Pass retrieval metadata from narrative generation into the orchestrator run log without persisting prompts, vectors, or source content.
- [x] 2.3 Add tests proving metadata is omitted or bounded when retrieval is empty or unavailable.

## 3. UI and diagnosis guardrails

- [x] 3.1 Shorten Knowledge Library helper copy and clarify that reindexing refreshes Qdrant searchability.
- [x] 3.2 Verify reviewer/lesson behavior does not blacklist persona vocabulary or enforce one reasoning sequence; add a narrow regression test if a guard is touched.

## 4. Regression and handoff

- [x] 4.1 Add unit tests for semantic-only, lexical-only, overlapping, empty, and Qdrant-failure retrieval.
- [x] 4.2 Run `npm run check:lines`, `npm test`, and `npm run build`.
- [x] 4.3 Validate the OpenSpec change and update context docs if the final API/schema contract changes.
