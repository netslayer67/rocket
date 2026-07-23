# serverless-sse-replay Specification

## Purpose
TBD - created by archiving change v1-serverless-sse-replay. Update Purpose after archive.
## Requirements
### Requirement: Production generation jobs are shared across function instances
The API SHALL persist a compact job payload and queued event before returning `jobId` from `POST /api/narratives/generate`.

#### Scenario: POST returns a replayable job
- **WHEN** a valid generation DTO is submitted
- **THEN** the API returns a UUID `jobId` and stores a queued event in MongoDB

### Requirement: SSE replays and starts a job once
`GET /api/narratives/events?jobId=...` SHALL replay unseen events in sequence order and atomically start the runner only once after the queued event is available.

#### Scenario: Successful generation lifecycle
- **WHEN** an SSE client subscribes to a persisted job
- **THEN** it receives `queued`, `generating`, `reviewing`, `saved`, and `complete` in that order, with `complete` after the draft is saved

#### Scenario: Provider failure
- **WHEN** the narrative provider fails
- **THEN** SSE emits one terminal `error` event with a safe message and closes the stream

### Requirement: Job records remain bounded and safe
Job state SHALL contain only DTO metadata and compact lifecycle data; it MUST NOT persist raw imported thread content or credentials, and stale jobs SHALL return a safe not-found/expired error.

#### Scenario: Unknown or expired job
- **WHEN** an SSE client requests a missing or expired job ID
- **THEN** the API returns a safe terminal error without invoking the narrative runner

