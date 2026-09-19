## MODIFIED Requirements

### Requirement: Bounded learning trigger
The system SHALL expose a manual learning run, SHALL process explicitly approved feedback immediately when it is submitted, SHALL optionally process pending approved feedback on a bounded interval in a persistent API process, and SHALL retain an authenticated serverless cron trigger as a rollback path. All outcomes SHALL remain compact monitoring activity and SHALL never publish content.

#### Scenario: Operator runs learning
- **WHEN** an operator requests a learning run
- **THEN** the API returns processed, skipped, and failed counts, reindexes created metadata, and monitoring exposes the run result without raw feedback notes

#### Scenario: Approved feedback is submitted
- **WHEN** feedback is recorded with `approvedForLearning` true
- **THEN** the API immediately attempts its idempotent diagnosis-first lesson creation without publishing content

#### Scenario: Persistent interval elapses
- **WHEN** the configured interval elapses on the persistent Railway API process
- **THEN** the service processes a bounded batch of approved pending feedback and publishes no external content

#### Scenario: Serverless cron runs during rollback
- **WHEN** a valid platform cron request invokes the learning endpoint while the Vercel API remains active
- **THEN** the API processes only approved pending feedback and publishes no external content
