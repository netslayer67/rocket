## ADDED Requirements

### Requirement: Reviewable outcome candidates
The system SHALL aggregate bounded manual analytics by narrative and return outcome candidates containing measured views, clicks, CTR, engagement rate, sample size, link placement, and status `candidate`. Candidates SHALL NOT be promoted to DNA automatically.

#### Scenario: Narrative has captured metrics
- **WHEN** manual analytics rows exist for a narrative
- **THEN** the candidate combines the rows, calculates transparent rates, and includes narrative context

#### Scenario: Views are zero
- **WHEN** an aggregated candidate has zero views
- **THEN** CTR and engagement rate are null

#### Scenario: Candidate is shown to the operator
- **WHEN** the analytics panel requests insights
- **THEN** it displays the manual source and candidate status, with no claim of causation or automatic learning

### Requirement: Missing narrative is ignored safely
The system SHALL skip analytics rows whose narrative no longer exists without failing the complete insights response.

#### Scenario: Orphaned analytics row
- **WHEN** an analytics row references a missing narrative
- **THEN** the endpoint omits that row and returns candidates for remaining narratives
