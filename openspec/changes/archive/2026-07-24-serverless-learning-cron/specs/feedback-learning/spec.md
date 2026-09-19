## MODIFIED Requirements

### Requirement: Bounded learning trigger
The system SHALL expose a manual learning run, SHALL optionally process pending approved feedback on a daily in-process interval without publishing content, and SHALL support an authenticated serverless cron trigger. All outcomes SHALL remain compact monitoring activity when they occur.

#### Scenario: Serverless cron runs
- **WHEN** a valid platform cron request invokes the learning endpoint
- **THEN** the service processes approved pending feedback and publishes no external content
