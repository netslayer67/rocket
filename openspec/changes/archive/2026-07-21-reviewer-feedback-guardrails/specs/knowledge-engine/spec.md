## ADDED Requirements

### Requirement: Negative reviewer lesson metadata
The system SHALL support storing compact reviewer lessons as knowledge metadata, and generation SHALL treat low-naturalness or explicitly anti-pattern lessons as constraints to avoid rather than prose examples to copy.

#### Scenario: Reviewer lesson is stored
- **WHEN** an operator adds a negative narrative lesson
- **THEN** MongoDB stores only its pattern fields, and Qdrant receives the derived compact metadata after reindexing

#### Scenario: Negative lesson is retrieved
- **WHEN** a related narrative topic retrieves a lesson marked `anti-pattern` or with naturalness 2 or lower
- **THEN** the narrative prompt tells the model to avoid the failure mode and never reproduce source text
