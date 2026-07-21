## Why

The beach-wedding/batik draft is a useful negative lesson: its prose is readable, but it takes a shortcut from heat to product, uses marketplace language, and introduces an unsupported community conclusion. Storing that failure as metadata lets retrieval warn future generation without retaining the original thread.

## What Changes

- Add the reviewed beach-wedding failure as a negative lesson in the curated DNA fixture.
- Mark it as an anti-pattern with low naturalness so generation treats it as a constraint, not an example.
- Seed and reindex the new metadata record through the existing command.

Non-goals: storing the original draft, product URL, screenshot, or factual claims from the example.

## Capabilities

### New Capabilities
- None. This extends the existing curated knowledge fixture.

### Modified Capabilities
- `curated-knowledge-dna`: Include reviewed negative lessons in the repeatable metadata seed.

## Impact

Only `apps/api/data/knowledge-dna.json` and the existing seed/reindex flow are affected. MongoDB and Qdrant receive one additional metadata record; no API contract changes.
