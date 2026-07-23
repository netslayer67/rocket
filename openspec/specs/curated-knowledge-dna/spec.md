# Curated Knowledge DNA

## Purpose

Seed reviewed narrative patterns from non-text references while keeping the same metadata-only and semantic-index boundaries as ordinary knowledge imports.

## Requirements

### Requirement: Curated DNA is metadata only
The system SHALL allow reviewed positive and negative narrative lessons to be seeded without persisting screenshots, raw thread text, source URLs, or factual allegations.

#### Scenario: Seed curated references
- **WHEN** the curated seed command runs
- **THEN** it upserts one metadata record per pattern, marks each record `vectorStatus: pending`, and does not write raw source content

#### Scenario: Seed command is repeated
- **WHEN** the same seed command runs again
- **THEN** it updates the existing records by stable label instead of creating duplicates

#### Scenario: Negative lesson is seeded
- **WHEN** an operator adds a reviewed failure pattern
- **THEN** the record stores only its reusable failure metadata, has a low naturalness score, and is marked for normal reindexing

#### Scenario: Batik authenticity lesson is seeded
- **WHEN** the curated seed command runs with the batik negative lesson
- **THEN** it stores only the persona-cosplay and evidence-consistency failure pattern, marks it low-naturalness, and sends it through normal reindexing

#### Scenario: Negative lesson is retrieved
- **WHEN** generation retrieves the beach-wedding product-injection pattern
- **THEN** the prompt treats it as an anti-pattern to avoid, not as wording or factual source material

### Requirement: Curated DNA enters normal retrieval
The system SHALL send seeded records through the existing vector reindex flow before semantic retrieval uses them.

#### Scenario: Reindex seeded records
- **WHEN** the knowledge reindex endpoint processes the seeded records
- **THEN** it updates their vector status and embedding metadata using the existing orchestrator and Qdrant collection
