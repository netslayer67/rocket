## MODIFIED Requirements

### Requirement: Generation lifecycle events
The SSE stream SHALL emit named, JSON-encoded lifecycle events for queued, generating, reviewing, saved, complete, and error states. A terminal error SHALL carry an incomplete progress value below 100 and a user-safe message.

#### Scenario: Draft succeeds
- **WHEN** generation, review, and persistence complete
- **THEN** the stream emits `complete` only after the draft is saved and includes the saved narrative in its event data

#### Scenario: Draft fails
- **WHEN** any generation or persistence step fails
- **THEN** the stream emits `error` with a user-safe message, an incomplete progress value, and never emits a false `complete` event
