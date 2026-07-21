## Why

Two additional high-engagement references add useful structural DNA: an urgent consumer-safety warning and a low-budget recipe tutorial. The engine should learn their hooks, emotional pacing, visual proof, and contextual link placement without storing screenshots or raw thread text.

## What Changes

- Add two curated metadata-only knowledge patterns.
- Add an idempotent seed command that upserts the patterns into MongoDB as pending vector records.
- Reindex the records through the existing knowledge reindex flow.

Non-goals: copying source wording, storing screenshots or URLs, changing the LLM orchestrator, or enabling automatic publishing. Safety-sensitive warning patterns remain structural guidance only and must not be reused as unverified claims.

## Capabilities

### New Capabilities
- `curated-knowledge-dna`: Store and seed reviewed narrative-pattern metadata without raw source content.

### Modified Capabilities
- None. Existing `knowledge-engine` requirements already cover metadata-only records and reindexing.

## Impact

Adds a small metadata fixture, an idempotent Node seed script, and a package command. Existing knowledge records are untouched; seeded records are marked pending until the existing reindex endpoint creates their vectors.
