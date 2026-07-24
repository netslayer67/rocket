## ADDED Requirements

### Requirement: Explicit outcome promotion
The system SHALL allow an operator to promote a manual analytics candidate into one diagnosis-first Knowledge DNA lesson only when the request explicitly contains `approved: true` and a positive or negative lesson type.

#### Scenario: Positive candidate is approved
- **WHEN** an operator approves a candidate with `approved: true` and `lessonType: positive`
- **THEN** the API creates one Knowledge lesson with manual-analytics provenance, sample context, diagnosis, and no causal claim, indexes it through KnowledgeService, links it to the narrative, and returns `promoted`

#### Scenario: Negative candidate is approved
- **WHEN** an operator approves a candidate with `approved: true` and `lessonType: negative`
- **THEN** the API stores a negative diagnosis with bounded failure dimensions and a recommended fix before returning the promoted lesson id

#### Scenario: Approval is missing or false
- **WHEN** a promotion request omits approval or sends `approved: false`
- **THEN** validation rejects the request and no lesson or narrative link is created

#### Scenario: Candidate has no manual analytics
- **WHEN** an operator attempts promotion for a narrative without a bounded analytics candidate
- **THEN** the API rejects the request and does not create Knowledge DNA

#### Scenario: Promotion is repeated
- **WHEN** an already promoted narrative is submitted again
- **THEN** the API returns the existing Knowledge lesson id with an idempotent status and creates no duplicate lesson

### Requirement: Promotion status is visible
The system SHALL expose candidate or promoted status in analytics insights and SHALL provide a compact dashboard control that requires confirmation before promotion.

#### Scenario: Dashboard lists a candidate
- **WHEN** analytics insights contain an unpromoted narrative
- **THEN** the dashboard shows its manual sample context, lesson type selector, and explicit promotion action

#### Scenario: Dashboard lists a promoted outcome
- **WHEN** the narrative has an outcome Knowledge id
- **THEN** the dashboard shows DNA saved status and does not offer a second promotion action
