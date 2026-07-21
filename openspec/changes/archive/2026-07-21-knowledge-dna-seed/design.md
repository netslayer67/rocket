## Context

The knowledge collection already stores extracted pattern metadata and the API already reindexes pending records. There is no repeatable way to add curated DNA when the source is an image or when manual extraction is more reliable than another LLM pass.

## Decisions

- Keep the two patterns in a JSON fixture containing only schema fields; omit source text, screenshots, and source URLs.
- Use a Node script with the existing Mongoose dependency to upsert by `sourceLabel`, making repeated runs safe.
- Set `vectorStatus` to `pending` on every upsert, then use the existing `/knowledge/reindex` endpoint to derive Qdrant vectors.
- Record safety-sensitive language in metadata so generation treats the clinic-warning pattern as structure, not as a factual claim.

## Trade-offs

- The fixture is curated manually instead of extracted by an LLM, which is deterministic and avoids storing raw image text.
- Reindex remains a separate command, which keeps the seed script short and reuses the existing vector pipeline.
