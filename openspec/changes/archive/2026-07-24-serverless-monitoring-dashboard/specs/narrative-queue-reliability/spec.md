## MODIFIED Requirements

### Requirement: Confirmed draft appears immediately
The dashboard SHALL prepend the narrative returned by a successful generation job completion event to the review queue without requiring a second page refresh, and the same compact job lifecycle SHALL be available to the monitoring surface.

#### Scenario: Generation succeeds
- **WHEN** the SSE stream emits a persisted narrative in its `complete` event
- **THEN** the review queue shows that draft immediately with its reviewer notes and draft status, while monitoring records the completed job state without exposing the draft body

#### Scenario: Generation fails
- **WHEN** the SSE stream emits an `error` event or closes before completion
- **THEN** the queue remains unchanged, the existing text status reports the error, and monitoring exposes a failed job event with a retryable job ID

### Requirement: Stale refresh cannot overwrite newer state
The dashboard SHALL apply only the newest completed refresh result to its collection state.

#### Scenario: Initial refresh finishes after generation
- **WHEN** an older initial refresh completes after a newer generation result has been applied
- **THEN** the older result does not remove the newly shown draft

#### Scenario: One refresh endpoint fails
- **WHEN** a background refresh fails after generation has returned a draft
- **THEN** the confirmed draft remains visible and the status explains that the dashboard needs refreshing
