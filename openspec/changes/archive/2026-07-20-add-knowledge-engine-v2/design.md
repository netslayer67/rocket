## Context

V1 extracts a small pattern document and uses topic-token matching. V2 adds a second, semantic retrieval path while preserving MongoDB as the source of truth and the V1 fallback. The affected applications are `apps/api` and `apps/web`; no existing API is removed.

## Goals / Non-Goals

**Goals:**

- Persist richer, pattern-only narrative metadata.
- Embed a compact retrieval document through `AiOrchestratorService` and query Qdrant by cosine similarity.
- Keep generation working when either embedding or Qdrant is unavailable.
- Provide reindexing and a visible Knowledge Library.

**Non-Goals:**

- Store raw imported content, add a queue, create analytics feedback loops, or auto-publish.
- Support changing embedding models against an existing collection without reindexing.

## Decisions

### Use OpenRouter embeddings through the existing orchestrator

`AiOrchestratorService.embed` calls `/api/v1/embeddings` with a configured model and `search_document` or `search_query` input type. The default is the currently available free NVIDIA embedding model. A single embedding model is used per collection because Qdrant requires vectors in a collection to share dimensionality. Chat model fallback remains unchanged; embedding failure falls back to lexical retrieval instead of mixing dimensions.

### Use Qdrant REST with native fetch

The existing runtime already has `fetch`; adding a client package only wraps three requests. `VectorIndexService` creates a cosine collection from the first embedding dimension, upserts only a stable point ID plus Mongo knowledge ID payload, and queries the collection. MongoDB retains all pattern metadata.

### Keep indexing best-effort

Pattern extraction succeeds even if vector infrastructure is offline. The record is marked `pending`, and a reindex endpoint can retry every stored document. This preserves V1 usability during local setup.

### Use one compact retrieval document

The embedding text is generated from extracted metadata rather than raw threads. Generation receives only the top semantic patterns, with lexical matches as fallback, limiting both token use and data retention.

## Risks / Trade-offs

- [Embedding model changes dimension] → Reject incompatible vectors and run reindex after choosing a new collection/model.
- [Free provider outage or limit] → Mark index pending and use lexical retrieval.
- [Synchronous reindex] → Suitable for early libraries; move it to BullMQ when V3 adds jobs.
- [Qdrant not started locally] → Docker Compose includes it, but API behavior remains functional without it.

## Migration Plan

1. Start the added Qdrant service with Docker Compose.
2. Deploy the schema update; older records read as `pending`.
3. Call `POST /knowledge/reindex` once to build missing vectors.
4. Rollback by removing Qdrant configuration; MongoDB and lexical retrieval remain valid.

## Open Questions

- V3 must decide how model-quality benchmarks influence the chat router.
- V3 must choose queue concurrency and retry policy for large reindex jobs.
