## MODIFIED Requirements

### Requirement: Curated DNA is metadata only
The system SHALL allow reviewed positive and negative narrative lessons to be seeded without persisting screenshots, raw thread text, source URLs, or factual allegations. Each lesson MAY include compact diagnosis, root cause, recommended fix, failure dimensions, and evidence-source labels.

#### Scenario: Seed curated references
- **WHEN** the curated seed command runs
- **THEN** it upserts one metadata record per pattern, marks each record `vectorStatus: pending`, and does not write raw source content

#### Scenario: Seed command is repeated
- **WHEN** the same seed command runs again
- **THEN** it updates the existing records by stable label instead of creating duplicates

#### Scenario: Negative lesson is seeded
- **WHEN** an operator adds a reviewed failure pattern
- **THEN** the record stores only its reusable failure metadata, has a low naturalness score, and is marked for normal reindexing

#### Scenario: Diagnosis is seeded
- **WHEN** a lesson includes a diagnosis, root cause, recommended fix, or failure dimensions
- **THEN** those compact fields are stored as metadata and remain available to retrieval without storing the source draft

#### Scenario: Negative lesson is retrieved
- **WHEN** generation retrieves the beach-wedding product-injection pattern
- **THEN** the prompt treats it as an anti-pattern to avoid, not as wording or factual source material
