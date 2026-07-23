## MODIFIED Requirements

### Requirement: Curated DNA is metadata only

The system SHALL allow reviewed negative lessons to be seeded without persisting screenshots, raw thread text, source URLs, or unsupported product claims.

#### Scenario: Batik authenticity lesson is seeded
- **WHEN** the curated seed command runs with the batik negative lesson
- **THEN** it stores only the failure pattern, marks it low-naturalness, and sends it through normal reindexing
