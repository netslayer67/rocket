## Why

The new batik draft matches the persona's vocabulary but not its thinking. It introduces community and creative context as keywords, describes garment details without evidence, and turns an observation into a product brochure before the reference appears.

## What Changes

- Add the batik failure as a metadata-only negative lesson.
- Treat persona as reasoning style rather than a vocabulary quota in generation and rewrite prompts.
- Block forced persona context and unsupported garment claims in the reviewer.
- Add a regression test and reindex the new lesson.

Non-goals: storing the original draft, product URL, screenshot, or changing the Persona schema in this small fix.

## Capabilities

### New Capabilities
- None. The lesson extends curated knowledge DNA.

### Modified Capabilities
- `curated-knowledge-dna`: Add the batik authenticity negative lesson.
- `narrative-authenticity-review`: Guard persona reasoning and evidence consistency.

## Impact

Updates the curated metadata fixture, narrative prompts, deterministic reviewer, and tests. MongoDB/Qdrant receive one additional metadata record; no API contract changes.
