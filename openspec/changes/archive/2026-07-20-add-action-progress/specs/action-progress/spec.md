## ADDED Requirements

### Requirement: Estimated action progress
The system SHALL show a labelled, animated, percentage-based estimated progress indicator while a narrative-form request is pending.

#### Scenario: Creator generates a narrative
- **WHEN** the creator submits the narrative form
- **THEN** the form shows an estimated percentage, a readable current activity, and disabled action controls until the request settles

#### Scenario: Request is still pending
- **WHEN** the backend request remains pending
- **THEN** the estimated percentage advances but stops before completion

#### Scenario: Request resolves
- **WHEN** the request succeeds or fails
- **THEN** the form shows a brief success or failure result and removes the pending indicator
