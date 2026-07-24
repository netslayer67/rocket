## Why

V1 proves that Rocket can store DNA and use Qdrant, but retrieval currently behaves as a semantic-first shortcut with a lexical fallback. That can miss useful patterns when a topic uses different words, and it gives us no compact explanation of why a pattern entered generation context. V2 should make the Knowledge Engine a reliable, inspectable hybrid retrieval layer before adding broader automation.

## What Changes

- Merge semantic and lexical candidates deterministically, deduplicate them, and preserve relevance ordering.
- Keep diagnosis-first positive/negative lessons as constraints or optional guidance; never copy source text or force one narrative template.
- Record compact retrieval metadata for observability (mode and matched knowledge IDs), without storing prompts, source content, or credentials.
- Add focused tests for semantic matches, lexical-only matches, duplicates, empty knowledge, and provider/Qdrant failure.
- Clarify the Knowledge Library status copy so operators understand pending/ready vectors and reindex behavior.

Non-goals: automatic crawling, bulk ingestion, trend discovery, Threads replies, platform analytics ingestion, BullMQ scheduling, and autonomous publishing.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `knowledge-engine`: hybrid retrieval and retrieval observability become explicit requirements while preserving metadata-only storage.

## Impact

`KnowledgeService`, `VectorIndexService`, the AI run telemetry schema, Knowledge Library UI copy, and API tests. Narrative generation keeps the same manual review and approval boundary; only the quality and explainability of its retrieved context changes.
