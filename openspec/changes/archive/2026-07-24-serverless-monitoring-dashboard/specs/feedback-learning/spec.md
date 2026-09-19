## MODIFIED Requirements

### Requirement: Bounded learning trigger
The system SHALL expose a manual learning run and SHALL optionally process pending approved feedback on a daily in-process interval without publishing content. Both outcomes SHALL be represented as compact monitoring activity when they occur.

#### Scenario: Operator runs learning
- **WHEN** an operator requests a learning run
- **THEN** the API returns processed, skipped, and failed counts, reindexes created metadata, and monitoring exposes the run result without raw feedback notes

#### Scenario: Daily tick is enabled
- **WHEN** the configured learning interval elapses
- **THEN** the service processes approved pending feedback and publishes no external content; monitoring labels the event as scheduled learning
