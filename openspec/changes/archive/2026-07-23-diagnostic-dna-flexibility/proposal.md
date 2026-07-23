## Why

The current batik guardrails correctly catch a failure, but they risk becoming word bans and a single mandatory narrative recipe. Rocket needs diagnosis-driven DNA that explains why a draft fails, accepts evidence-backed product observations, preserves multiple human narrative shapes, and learns from positive as well as negative lessons.

## What Changes

- Add optional lesson metadata: positive/negative type, diagnosis, root cause, recommended fix, failure dimensions, and evidence sources.
- Replace persona-word and firsthand-only checks with context/evidence checks; ordinary words remain valid when the scene earns them.
- Mark `Observe -> Wonder -> Hypothesis -> Reference -> Open Question` as a preferred pattern, not a required sequence.
- Pass compact diagnosis fields into retrieval prompts without storing raw source text.
- Update OpenSpec and Ponytail project rules to require diagnosis, positive/negative coverage, diversity checks, and a documented ceiling for narrow heuristics.

Non-goals: no new detector dependency, no automatic publishing, no raw thread storage, and no redesign of the Persona UI/schema beyond optional knowledge metadata.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `curated-knowledge-dna`: support diagnosis-rich positive and negative lessons with evidence provenance.
- `narrative-authenticity-review`: make persona and product checks context-aware and keep narrative structures diverse.
- `project-governance`: make OpenSpec/Ponytail guardrails explicit for diagnosis-based learning and anti-overfitting.

## Impact

Updates the knowledge Mongoose shape/parser, curated metadata, retrieval context, deterministic reviewer, generation prompts, project context rules, and regression tests. MongoDB/Qdrant receive compact metadata only; existing records remain compatible because new fields are optional.
