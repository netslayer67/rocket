## Why

V1 can store a compact narrative pattern, but retrieval is lexical and loses useful matches when a new topic uses different wording. V2 needs semantic retrieval and richer pattern evidence so generation can learn from knowledge rather than a growing prompt.

## What Changes

- Expand extracted pattern metadata with conflict, information gap, discussion, authority, CTA, and naturalness signals.
- Generate embeddings through the existing AI Orchestrator and index pattern-only documents in Qdrant.
- Retrieve semantic matches for generation, with lexical retrieval as a safe fallback when Qdrant or embeddings are unavailable.
- Add reindexing and a Knowledge Library view so V1 records can join the vector index and users can inspect stored patterns.
- Complete V2 context, schema, architecture, and runbook documentation.

## Capabilities

### New Capabilities

- `knowledge-engine`: Pattern extraction, semantic indexing, retrieval, reindexing, and knowledge-library visibility.

### Modified Capabilities

- Tidak ada.

## Impact

Affects the NestJS `ai`, `knowledge`, and `narratives` modules; MongoDB knowledge documents; local Docker services; API environment values; and the Next.js dashboard. Qdrant is added as local infrastructure. No raw thread is persisted, no external publishing is added, and V3 analytics/queue work remains out of scope.
