## MODIFIED Requirements

### Requirement: Analytics summary
The system SHALL expose a compact summary of captured metrics for the dashboard and SHALL identify the source as manual capture. It SHALL also expose a separate read-only outcome-candidate view derived from the same bounded manual rows, with candidate or promoted status and an explicit promotion endpoint.

#### Scenario: Summary is requested
- **WHEN** the dashboard requests analytics summary
- **THEN** the API returns totals, average rates, and the manual source label

#### Scenario: Outcome insights are requested
- **WHEN** the dashboard requests analytics insights
- **THEN** the API returns grouped candidates with sample size, context, transparent rates, manual source, and candidate or promoted status

#### Scenario: Candidate is promoted explicitly
- **WHEN** the operator posts an approved positive or negative lesson decision for a candidate
- **THEN** the API creates one diagnosis-first Knowledge lesson, links it to the narrative, and subsequent insights report promoted status
