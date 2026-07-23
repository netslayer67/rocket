## ADDED Requirements

### Requirement: Manual metric capture
The system SHALL accept operator-entered views, clicks, likes, replies, reposts, and quotes for a narrative and SHALL compute CTR and engagement rate from measured values.

#### Scenario: Metrics are saved
- **WHEN** an operator submits non-negative metrics for a narrative
- **THEN** the API stores the metrics with capture time and returns derived CTR and engagement rate

#### Scenario: Views are zero
- **WHEN** metrics contain zero views
- **THEN** CTR and engagement rate are returned as null rather than an invented percentage

### Requirement: Analytics summary
The system SHALL expose a compact summary of captured metrics for the dashboard and SHALL identify the source as manual capture.

#### Scenario: Summary is requested
- **WHEN** the dashboard requests analytics summary
- **THEN** the API returns totals, average rates, and the manual source label
