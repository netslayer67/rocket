## MODIFIED Requirements

### Requirement: Narrative generation job stream
The API SHALL create a bounded narrative generation job, return a unique `jobId` immediately, and expose its SSE stream at `GET /narratives/events?jobId={jobId}`.

#### Scenario: Job is accepted
- **WHEN** a valid creator submits `POST /narratives/generate`
- **THEN** the API returns a `jobId` without waiting for the AI request or Mongo persistence to finish

#### Scenario: Browser subscribes
- **WHEN** the browser opens `GET /narratives/events?jobId={jobId}`
- **THEN** the API returns `text/event-stream` events for that job or a clear not-found error for an unknown or expired job
