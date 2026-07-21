## Why

Two reviewed drafts expose a V1 gap: the reviewer catches generic phrasing but not scene drift, object mismatch, or the overly tidy “observation → conclusion” shape. The engine needs to learn from both rejection and near-approval so future drafts stay concrete, personal, coherent, and exploratory.

## What Changes

- Add metadata-only DNA for the rejected neon-shoe draft and the near-approval community-shoe draft.
- Detect scene, object, activity, environment, cause-effect, and observation mismatches in the reviewer.
- Require a concrete information gap and at least one uncertainty/process-of-thought cue when the draft is conversational.
- Treat abstract metaphors, generic adjectives, unexplained object claims, and promotional transitions as review smells.
- Feed the new positive and negative lessons into generation and rewrite prompts without storing raw source text.
- Keep manual approval unchanged; low-quality drafts remain drafts and are rejected or revised.

## Capabilities

### New Capabilities

- `narrative-coherence`: Validate that scenes, objects, activities, environments, and causal observations share one understandable world.

### Modified Capabilities

- `narrative-naturalness`: Add process-of-thought, concrete-observation, AI-smell, and coherence gates.
- `knowledge-engine`: Store reusable positive/negative reviewer DNA as compact metadata.

## Impact

- Affects `NarrativeReviewService`, narrative prompts, regression tests, and the existing knowledge reindex path.
- Adds no dependency or API surface. Mongo stores only pattern metadata; Qdrant remains derived and may stay pending when embeddings are unavailable.
- No automatic publishing changes: approval remains explicit and reviewer failures remain visible to the creator.
