## MODIFIED Requirements

### Requirement: Analytics summary
The system SHALL expose a compact summary of captured metrics for the dashboard and SHALL identify the source as manual capture. It SHALL also expose a separate read-only outcome-candidate view derived from the same bounded manual rows.

#### Scenario: Summary is requested
- **WHEN** the dashboard requests analytics summary
- **THEN** the API returns totals, average rates, and the manual source label

#### Scenario: Outcome insights are requested
- **WHEN** the dashboard requests analytics insights
- **THEN** the API returns grouped candidates with sample size, context, transparent rates, manual source, and candidate status
