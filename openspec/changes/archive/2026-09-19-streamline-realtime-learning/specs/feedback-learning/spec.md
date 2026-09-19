## MODIFIED Requirements

### Requirement: Bounded learning trigger
The system SHALL process explicitly approved feedback immediately when it is recorded, SHALL process pending approved feedback on the configured persistent-service interval without publishing content, and SHALL retain an authenticated operational learning run without requiring a dashboard button. All outcomes SHALL remain compact monitoring activity when they occur.

#### Scenario: Approved feedback is recorded
- **WHEN** an operator submits feedback with `approvedForLearning` true
- **THEN** the system attempts the idempotent learning flow without waiting for a dashboard action

#### Scenario: Scheduled backlog tick is enabled
- **WHEN** the configured learning interval elapses on the persistent service
- **THEN** the service processes approved pending feedback and publishes no external content; monitoring labels the event as scheduled learning

#### Scenario: Operator runs learning
- **WHEN** an authorized operator requests the operational learning run
- **THEN** the API returns processed, skipped, and failed counts, reindexes created metadata, and monitoring exposes the run result without raw feedback notes

#### Scenario: Dashboard shows learning signals
- **WHEN** a creator opens the analytics panel
- **THEN** the panel explains that approved feedback is learned automatically and does not require a manual learning button

#### Scenario: Serverless cron runs
- **WHEN** a valid platform cron request invokes the learning endpoint
- **THEN** the service processes approved pending feedback and publishes no external content
