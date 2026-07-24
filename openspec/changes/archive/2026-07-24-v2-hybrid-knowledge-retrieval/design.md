## Context

V1 already extracts compact narrative DNA into MongoDB and derives Qdrant vectors. `KnowledgeService.findRelevant` currently returns semantic matches when any are available and only uses lexical topic matching when semantic search returns no usable record. This is safe, but it can hide useful lexical matches, make retrieval behavior hard to inspect, and make a single vector/provider failure look like an empty result.

This V2 increment keeps the existing NestJS, Mongoose, Qdrant, and AI Orchestrator boundaries. It does not introduce a queue, a new model provider, or a second source of truth. All source text remains transient.

## Goals / Non-Goals

**Goals:**

- Merge semantic and lexical candidates instead of choosing one retrieval path.
- Keep ordering deterministic and remove duplicate Mongo IDs.
- Preserve diagnosis-first positive/negative lesson metadata as guidance and constraints, without turning vocabulary into a blacklist or forcing one narrative sequence.
- Expose compact retrieval observability (`mode`, candidate counts, and matched knowledge IDs) through existing AI run metadata without storing prompts or source text.
- Make Knowledge Library copy explain that reindexing refreshes derived Qdrant vectors, not the learning itself.
- Add regression coverage for semantic, lexical-only, duplicate, empty, and provider-failure paths.

**Non-Goals:**

- Automatic crawling, scheduled learning, trend discovery, replies, platform analytics ingestion, or automatic publishing.
- Replacing Qdrant or MongoDB.
- Persisting raw imported threads, HTML, prompts, credentials, or generated source content in retrieval telemetry.
- Making `Observe → Wonder → Hypothesis` mandatory for every narrative.

## Decisions

### 1. Hybrid candidate merge in the knowledge service

`VectorIndexService.search` continues to return ordered Qdrant knowledge IDs. `KnowledgeService` obtains a bounded lexical candidate set (up to four records), then merges semantic records first and lexical records second, deduplicated by Mongo ID. Semantic relevance remains primary when available; lexical coverage supplements it rather than acting only as a fallback. If Qdrant fails, lexical results remain available. If both paths are empty, the existing recent-pattern fallback remains.

Alternative considered: concatenate all records and let the model choose. Rejected because it increases token use and makes ranking non-deterministic.

### 2. Compact retrieval telemetry

The orchestrator's existing AI run record gains optional retrieval metadata: retrieval mode, semantic/lexical candidate counts, and bounded matched knowledge IDs. This is metadata only. The prompt, source text, and vector values are never persisted. The narrative generation call supplies the metadata after retrieval and before completion logging.

Alternative considered: create a new retrieval collection. Rejected because the signal belongs to the existing AI decision record and a new collection would add operational overhead without improving V2 behavior.

### 3. Diagnosis-first lesson handling

Positive and negative DNA remain structured metadata with diagnosis, root cause, fix, dimensions, and evidence provenance. Retrieval does not reject a record because it contains a vocabulary term. Reviewer and prompt code may use lesson type and diagnosis to guide or constrain generation, but no single reasoning pattern is required.

Alternative considered: add a large forbidden-word list. Rejected because it would cause persona overfitting and false positives.

### 4. UI wording only

The existing Tailwind Knowledge Library keeps its layout and button contract. Copy is shortened and made explicit: reindexing synchronizes pending/stale patterns to Qdrant so semantic search can find them. No new dependency or visual system is added.

## Risks / Trade-offs

- **[Risk]** Hybrid results add more context than semantic-only retrieval. → **Mitigation:** keep the existing hard limit of four semantic plus four lexical candidates, deduplicate, and cap the final context at the existing retrieval budget.
- **[Risk]** Qdrant and Mongo ordering can diverge. → **Mitigation:** preserve Qdrant order for semantic records and sort lexical additions by `createdAt`.
- **[Risk]** Optional telemetry changes the AI run document shape. → **Mitigation:** fields are optional, backward compatible, and bounded to IDs/counts.
- **[Risk]** A provider outage can be misread as no knowledge. → **Mitigation:** record `lexical-fallback` or `empty` mode and keep the generation path non-blocking.

## Migration Plan

1. Deploy the service and schema changes; existing knowledge records remain valid.
2. Run the existing reindex endpoint for records marked pending or created before the new embedding model.
3. Verify a generation run records retrieval metadata and that the Knowledge Library status copy is clear.
4. Roll back by reverting the service/UI commit; optional telemetry fields are ignored by older code.

## Open Questions

- Whether a future V2.2 should persist per-candidate similarity scores. This increment deliberately stores IDs and counts only.
- Whether bulk reindexing needs BullMQ once the library exceeds the current synchronous safety limit. Until then, retain the Ponytail synchronous path.
