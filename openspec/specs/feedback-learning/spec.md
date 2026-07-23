# Feedback Learning

## Purpose

Turn explicit reviewer feedback into safe, diagnosis-first knowledge without retaining raw source text.

## Requirements

### Requirement: Structured reviewer feedback
The system SHALL accept bounded feedback dimensions for a stored narrative and SHALL require an explicit approval flag before feedback can change knowledge.

#### Scenario: Feedback is recorded
- **WHEN** an operator submits dimension scores and a diagnosis note for a narrative
- **THEN** the API stores the narrative reference, scores, note, and learning approval without storing a raw imported thread

#### Scenario: Feedback is not approved for learning
- **WHEN** feedback is recorded with `approvedForLearning` false
- **THEN** the learning runner leaves it pending and does not create a Knowledge lesson

### Requirement: Diagnosis-first feedback learning
The learning runner SHALL convert explicitly approved feedback into compact positive or negative Knowledge metadata containing diagnosis, root cause, recommended fix, failure dimensions, and evidence-source labels when available.

#### Scenario: Approved negative lesson
- **WHEN** approved feedback scores a draft below the configured quality threshold or marks it negative
- **THEN** the runner creates one negative diagnosis lesson and indexes only its metadata

#### Scenario: Approved positive lesson
- **WHEN** approved feedback marks a draft as positive
- **THEN** the runner creates one positive guidance lesson without copying the draft body as a source

#### Scenario: Learning is rerun
- **WHEN** the same approved feedback is encountered again
- **THEN** the runner reports it as already learned and does not duplicate the lesson

### Requirement: Bounded learning trigger
The system SHALL expose a manual learning run and SHALL optionally process pending approved feedback on a daily in-process interval without publishing content.

#### Scenario: Operator runs learning
- **WHEN** an operator requests a learning run
- **THEN** the API returns processed, skipped, and failed counts and reindexes created metadata

#### Scenario: Daily tick is enabled
- **WHEN** the configured learning interval elapses
- **THEN** the service processes approved pending feedback and publishes no external content
