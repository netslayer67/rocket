## Purpose

Expose narrative generation progress through a native server-sent event stream so a saved draft reaches the review queue without a page refresh.

## Requirements

### Requirement: Narrative generation job stream
The API SHALL create a bounded narrative generation job, return a unique `jobId` immediately, and expose an SSE stream for that job.

#### Scenario: Job is accepted
- **WHEN** a valid creator submits `POST /narratives/generate`
- **THEN** the API returns a `jobId` without waiting for the AI request or Mongo persistence to finish

#### Scenario: Browser subscribes
- **WHEN** the browser opens `GET /narratives/events?jobId={jobId}`
- **THEN** the API returns `text/event-stream` events for that job or a clear not-found error for an unknown or expired job

### Requirement: Generation lifecycle events
The SSE stream SHALL emit named, JSON-encoded lifecycle events for queued, generating, reviewing, saved, complete, and error states.

#### Scenario: Draft succeeds
- **WHEN** generation, review, and persistence complete
- **THEN** the stream emits `complete` only after the draft is saved and includes the saved narrative in its event data

#### Scenario: Draft fails
- **WHEN** any generation or persistence step fails
- **THEN** the stream emits `error` with a user-safe message and never emits a false `complete` event

### Requirement: Stream safety
The job stream SHALL emit only progress metadata and the persisted narrative result, never prompts, raw imported source text, credentials, or access tokens.

#### Scenario: Job finishes
- **WHEN** the stream closes after `complete` or `error`
- **THEN** the job is removed from the in-process registry after a bounded cleanup delay
