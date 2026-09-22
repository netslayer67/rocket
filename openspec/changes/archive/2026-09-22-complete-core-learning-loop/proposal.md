## Why

Rocket can already create drafts, retrieve persona-scoped DNA, and run bounded internal learning. The remaining gap is accountability: a saved draft does not expose which compact knowledge informed it, its quality evaluation is only a list of notes, and autonomous learning cannot report whether its new DNA improves the next draft checks.

## What Changes

- Save bounded retrieval provenance and a deterministic quality evaluation with every generated draft.
- Show creators the retrieval mode, number of patterns used, and actionable draft-quality dimensions in the existing studio review flow.
- Have the existing autonomous learner measure the quality of newly generated drafts from its active persona and retain only compact aggregate results; it never publishes, edits, or claims model training.
- Keep retrieval and learning strictly scoped to the active persona and keep raw source text and prompts out of storage.

## Capabilities

### New Capabilities

- `draft-quality-evaluation`: Persist and present deterministic draft-quality dimensions that support review and internal-learning measurement.

### Modified Capabilities

- `knowledge-engine`: Return bounded retrieval provenance with a generated draft while preserving active-persona isolation.
- `autonomous-internal-learning`: Include compact, non-causal quality measurements in each accepted learning cycle.
- `narrative-studio-ui`: Present knowledge provenance and quality results in the existing responsive review flow.
- `narrative-authenticity-review`: Define how consistency, specificity, stereotype risk, and hidden-selling checks become evaluable draft dimensions.

## Impact

The NestJS narrative, knowledge, feedback/learning, and monitoring paths gain compact metadata fields and tests. The existing Next.js studio displays that metadata using its current components and Tailwind primitives. No dependency, background service, paid model route, raw-source storage, automatic publishing, or automated analytics ingestion is added.
