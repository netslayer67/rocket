## MODIFIED Requirements

### Requirement: Negative reviewer lesson metadata
The system SHALL support storing compact positive and negative reviewer lessons as knowledge metadata, including a diagnosis, root cause, recommended fix, failure dimensions, and evidence-source labels when available. Generation SHALL treat low-naturalness or explicitly negative lessons as constraints to avoid rather than prose examples to copy.

#### Scenario: Positive lesson is stored
- **WHEN** an operator adds a near-approved narrative lesson
- **THEN** MongoDB stores its reusable hook, voice, process, link, coherence pattern, and optional positive diagnosis without raw source text

#### Scenario: Reviewer lesson is stored
- **WHEN** an operator adds a negative narrative lesson
- **THEN** MongoDB stores only its pattern fields and diagnosis metadata, and Qdrant receives the derived compact metadata after reindexing

#### Scenario: Negative lesson is retrieved
- **WHEN** a related narrative topic retrieves a lesson marked `negative` or with naturalness 2 or lower
- **THEN** the narrative prompt tells the model to avoid the diagnosed failure mode and never reproduce source text

#### Scenario: Positive lesson is retrieved
- **WHEN** a related narrative topic retrieves a lesson marked `positive` with naturalness 4 or higher
- **THEN** the narrative prompt uses its pattern fields as guidance while preserving the current topic, persona, reference, and a different valid narrative shape when appropriate
