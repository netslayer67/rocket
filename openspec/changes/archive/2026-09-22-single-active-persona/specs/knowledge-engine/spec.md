## ADDED Requirements

### Requirement: Active-persona knowledge scope
The Knowledge Engine SHALL associate every newly imported, feedback-derived, outcome-derived, or autonomous lesson with the active persona and SHALL use only that scope in retrieval. It MUST retain raw-source restrictions and must not infer an owner for unscoped legacy metadata.

#### Scenario: Creator imports a pattern
- **WHEN** an active persona imports compact source metadata
- **THEN** the resulting knowledge record is indexed with the active persona ID

#### Scenario: Legacy pattern is present
- **WHEN** a pre-scope knowledge record has no persona ID
- **THEN** it remains retained but is not returned as context for the active persona
