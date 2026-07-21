# Knowledge Engine

## MODIFIED Requirements

### Requirement: Negative reviewer lesson metadata
The system SHALL support storing compact positive and negative reviewer lessons as knowledge metadata, and generation SHALL treat low-naturalness or explicitly anti-pattern lessons as constraints to avoid rather than prose examples to copy.

#### Scenario: Positive lesson is stored
- **WHEN** an operator adds a near-approved narrative lesson
- **THEN** MongoDB stores its reusable hook, voice, process, link, and coherence pattern without raw source text

#### Scenario: Negative lesson is stored
- **WHEN** an operator adds a rejected narrative lesson
- **THEN** MongoDB stores only its failure modes, scores, and compact metadata, with no raw source text

#### Scenario: Negative lesson is retrieved
- **WHEN** a related narrative topic retrieves a lesson marked `anti-pattern` or with naturalness 2 or lower
- **THEN** the narrative prompt tells the model to avoid the failure mode and never reproduce source text

#### Scenario: Positive lesson is retrieved
- **WHEN** a related narrative topic retrieves a lesson with naturalness 4 or higher
- **THEN** the narrative prompt uses its pattern fields as guidance while preserving the current topic, persona, and reference
