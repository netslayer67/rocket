# Outcome Learning Candidates

## Purpose

Summarize operator-entered outcomes as reviewable signals without silently converting them into DNA.

## Requirements

### Requirement: Reviewable outcome candidates
The system SHALL aggregate bounded manual analytics by narrative and return outcome candidates containing measured views, clicks, CTR, engagement rate, sample size, link placement, and status `candidate` or `promoted`. Candidates SHALL NOT be promoted to DNA automatically; promotion requires an explicit typed approval.

#### Scenario: Narrative has captured metrics
- **WHEN** manual analytics rows exist for a narrative
- **THEN** the candidate combines the rows, calculates transparent rates, and includes narrative context

#### Scenario: Views are zero
- **WHEN** an aggregated candidate has zero views
- **THEN** CTR and engagement rate are null

#### Scenario: Candidate is shown to the operator
- **WHEN** the analytics panel requests insights
- **THEN** it displays the manual source and candidate status, with no claim of causation or automatic learning

#### Scenario: Candidate is explicitly promoted
- **WHEN** the operator approves a positive or negative lesson decision
- **THEN** one diagnosis-first Knowledge lesson is created, linked to the narrative, and later insights report promoted status

### Requirement: Missing narrative is ignored safely
The system SHALL skip analytics rows whose narrative no longer exists without failing the complete insights response.

#### Scenario: Orphaned analytics row
- **WHEN** an analytics row references a missing narrative
- **THEN** the endpoint omits that row and returns candidates for remaining narratives
