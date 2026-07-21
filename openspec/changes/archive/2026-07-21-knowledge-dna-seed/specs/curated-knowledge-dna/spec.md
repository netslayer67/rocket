## ADDED Requirements

### Requirement: Curated DNA is metadata only
The system SHALL allow reviewed narrative patterns to be seeded without persisting screenshots, raw thread text, or source URLs.

#### Scenario: Seed curated references
- **WHEN** the curated seed command runs
- **THEN** it upserts one metadata record per pattern, marks each record `vectorStatus: pending`, and does not write raw source content

#### Scenario: Seed command is repeated
- **WHEN** the same seed command runs again
- **THEN** it updates the existing records by stable label instead of creating duplicates

### Requirement: Curated DNA enters normal retrieval
The system SHALL send seeded records through the existing vector reindex flow before semantic retrieval uses them.

#### Scenario: Reindex seeded records
- **WHEN** the knowledge reindex endpoint processes the seeded records
- **THEN** it updates their vector status and embedding metadata using the existing orchestrator and Qdrant collection
