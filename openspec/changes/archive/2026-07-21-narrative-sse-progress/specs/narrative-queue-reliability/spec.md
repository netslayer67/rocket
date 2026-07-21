## MODIFIED Requirements

### Requirement: Confirmed draft appears immediately
The dashboard SHALL prepend the narrative returned by a successful generation job completion event to the review queue without requiring a second page refresh.

#### Scenario: Generation succeeds
- **WHEN** the SSE stream emits a persisted narrative in its `complete` event
- **THEN** the review queue shows that draft immediately with its reviewer notes and draft status

#### Scenario: Generation fails
- **WHEN** the SSE stream emits an `error` event or closes before completion
- **THEN** the queue remains unchanged and the existing text status reports the error

### Requirement: Stale refresh cannot overwrite newer state
The dashboard SHALL apply only the newest completed refresh result to its collection state.

#### Scenario: Initial refresh finishes after generation
- **WHEN** an older initial refresh completes after a newer generation result has been applied
- **THEN** the older result does not remove the newly shown draft

#### Scenario: One refresh endpoint fails
- **WHEN** a background refresh fails after generation has returned a draft
- **THEN** the confirmed draft remains visible and the status explains that the dashboard needs refreshing
