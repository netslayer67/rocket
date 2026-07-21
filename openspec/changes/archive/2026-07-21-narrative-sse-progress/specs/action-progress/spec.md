## MODIFIED Requirements

### Requirement: Estimated action progress
The system SHALL show a labelled, animated, percentage-based estimated progress indicator while a narrative-form request is pending, and SHALL replace that estimate with server-reported progress when a narrative generation SSE job is active.

#### Scenario: Creator generates a narrative
- **WHEN** the creator submits the narrative form
- **THEN** the form shows a pending percentage and readable current activity while it opens the generation job stream

#### Scenario: Server reports progress
- **WHEN** the generation SSE stream sends a stage and percentage
- **THEN** the form displays that server value and activity instead of advancing the client estimate

#### Scenario: Reference suggestion remains pending
- **WHEN** the creator requests a link suggestion
- **THEN** the existing client estimate advances while the HTTP request remains pending

#### Scenario: Request resolves
- **WHEN** the generation stream or suggestion request succeeds or fails
- **THEN** the form shows a brief success or failure result and removes the pending indicator
