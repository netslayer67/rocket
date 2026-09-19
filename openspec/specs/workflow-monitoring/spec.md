# Workflow Monitoring

## Purpose

Expose honest, serverless-safe workflow observability from persisted metadata without fabricating 24/7 agent activity.

## Requirements

### Requirement: Bounded monitoring history
The API SHALL expose a compact monitoring snapshot covering only persisted events from the previous 24 hours, with no prompts, raw imported source text, credentials, or generated narrative bodies.

#### Scenario: History is requested
- **WHEN** an operator requests `GET /monitoring/history`
- **THEN** the API returns at most 100 normalized events, a 24-hour window start, summary counts, and an explicit `source` of persisted metadata

#### Scenario: No recent activity exists
- **WHEN** no supported collection has a record in the 24-hour window
- **THEN** the API returns an empty event list and an idle status rather than fabricated agent activity

### Requirement: Serverless live stream
The API SHALL expose `GET /monitoring/events` as a bounded SSE stream that polls persisted state, emits an `activity` event only when the snapshot changes, and labels connection heartbeats separately.

#### Scenario: New activity is persisted
- **WHEN** a supported job, AI run, feedback, learning log, knowledge index, or analytics record changes during an open stream
- **THEN** the stream emits one compact `activity` event containing the updated snapshot

#### Scenario: No activity occurs
- **WHEN** the poll finds no persisted change
- **THEN** the stream emits only a `heartbeat` event and the UI does not mark an agent or model as active

#### Scenario: Stream reaches its serverless limit
- **WHEN** the configured stream window expires or the client disconnects
- **THEN** the server closes the observable cleanly and the client keeps the last known history

### Requirement: Explicit monitoring actions
The API SHALL provide confirmation-gated operations for retrying a stored narrative job, reindexing knowledge, and running approved feedback learning without publishing content.

#### Scenario: Retry a failed job
- **WHEN** an operator confirms retry for a stored job with a valid payload
- **THEN** the API creates a new job and returns its new job ID without mutating the original job

#### Scenario: Reindex knowledge
- **WHEN** an operator confirms reindex
- **THEN** the API runs the existing bounded knowledge reindex operation and returns indexed and pending counts

#### Scenario: Run learning
- **WHEN** an operator confirms a learning run
- **THEN** the API processes only explicitly approved pending feedback and returns processed, skipped, and failed counts

### Requirement: Monitoring dashboard
The web app SHALL expose `/monitoring` with a responsive neural-flow workflow map, live connection state, 24-hour summary, and an equivalent event timeline. The map geometry and active styling SHALL be derived from persisted event recency; it MUST NOT simulate activity while the serverless stream is idle.

#### Scenario: Dashboard loads
- **WHEN** an operator opens `/monitoring`
- **THEN** the page loads history, opens the bounded SSE stream, labels idle state honestly, and renders signals, agents, models, and memory from real event state

#### Scenario: Activity arrives
- **WHEN** the stream emits an `activity` event
- **THEN** the timeline updates and only matching nodes plus their related curved workflow paths receive an active state

#### Scenario: Narrow viewport
- **WHEN** the page is viewed on a narrow viewport or with reduced motion enabled
- **THEN** all events remain readable through the timeline, the map remains reachable without accidental page overflow, controls remain keyboard accessible, and decorative animation is disabled when requested

#### Scenario: Destructive or operational action
- **WHEN** an operator presses retry, reindex, or learning
- **THEN** the browser asks for confirmation before the request is sent and reports success or failure as text status
