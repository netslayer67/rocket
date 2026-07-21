## MODIFIED Requirements

### Requirement: Curated DNA is metadata only

The system SHALL allow reviewed positive and negative narrative lessons to be seeded without persisting screenshots, raw thread text, source URLs, or factual allegations.

#### Scenario: Negative lesson is seeded
- **WHEN** an operator adds a reviewed failure pattern
- **THEN** the record stores only its reusable failure metadata, has a low naturalness score, and is marked for normal reindexing

#### Scenario: Negative lesson is retrieved
- **WHEN** generation retrieves the beach-wedding product-injection pattern
- **THEN** the prompt treats it as an anti-pattern to avoid, not as wording or factual source material
