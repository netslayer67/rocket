## ADDED Requirements

### Requirement: Persistent approved-feedback learning
The system SHALL run the existing idempotent learning runner in one persistent Railway API process when `LEARNING_SCHEDULER_ENABLED=true`, and SHALL process only explicitly approved, unlearned feedback in bounded batches.

#### Scenario: Approved feedback is processed continuously
- **WHEN** an approved feedback record remains unlearned on the Railway API
- **THEN** the runner processes it within one configured interval, which MUST be at least 60 seconds, and creates at most one linked DNA lesson

#### Scenario: Unapproved feedback remains inert
- **WHEN** feedback is stored without learning approval
- **THEN** the persistent runner does not create a DNA lesson or publish any content

#### Scenario: Railway process restarts
- **WHEN** Railway restarts the single API process after a successful learning run
- **THEN** the runner resumes from persisted feedback and learning-log metadata without duplicating a completed lesson

### Requirement: Railway API liveness check
The API SHALL expose a public `GET /health` endpoint that returns a successful response after the NestJS application has started and does not expose credentials, account data, or learning records.

#### Scenario: Railway validates a deployment
- **WHEN** Railway requests `GET /health` during deployment
- **THEN** the API returns HTTP 200 and Railway can mark the API deployment healthy
