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
The API SHALL expose `GET /monitoring/events` as a bounded, read-only SSE stream that sends an initial snapshot, polls persisted events and actual worker state, emits `activity` when either changes, and labels connection heartbeats separately. Worker execution MUST NOT depend on this connection.

#### Scenario: New activity is persisted
- **WHEN** a supported job, AI run, feedback, learning log, autonomous cycle, knowledge index, analytics record, or worker state changes during an open stream
- **THEN** the stream emits one compact `activity` event containing the updated snapshot

#### Scenario: No activity occurs
- **WHEN** a poll after the initial snapshot finds no event or worker-state change
- **THEN** the stream emits only a `heartbeat` event and the UI does not mark an agent or model as active because of that heartbeat

#### Scenario: Stream reaches its serverless limit
- **WHEN** the configured stream window expires or the client disconnects
- **THEN** the server closes the observable cleanly and the client keeps the last known history while the persistent worker continues independently

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
The web app SHALL expose `/monitoring` with actual worker state first, a responsive activity timeline, separate live-connection state, concise 24-hour context, and an equivalent technical workflow map inside a labeled native disclosure. Active styling SHALL derive only from persisted event recency or the worker's reported processing stage; it MUST NOT simulate activity from connection heartbeats or waiting state.

#### Scenario: Dashboard loads
- **WHEN** an operator opens `/monitoring`
- **THEN** the page loads history, opens the bounded SSE stream, labels waiting honestly, shows the worker state and timeline before optional technical details, and renders the map from real event and worker state when expanded

#### Scenario: Activity arrives
- **WHEN** the stream emits an `activity` event
- **THEN** the timeline updates and only matching nodes plus their related workflow paths receive an active state; pending indexes do not activate Qdrant

#### Scenario: Narrow viewport
- **WHEN** the page is viewed on a narrow viewport or with reduced motion enabled
- **THEN** worker status and timeline remain readable, optional details are keyboard-expandable, the map remains keyboard-scrollable without accidental page overflow, controls remain keyboard accessible, and decorative animation is disabled when requested

#### Scenario: Destructive or operational action
- **WHEN** an operator expands maintenance and presses retry, reindex, or feedback recovery
- **THEN** the browser asks for confirmation before the request is sent and reports success or failure as text status; these actions are not prerequisites for autonomous learning

### Requirement: Autonomous learning visibility
Monitoring history and live snapshots SHALL expose whether autonomous learning is enabled, its real stage, last and next check, latest persisted result, bounded input count, and daily attempt limit. The interface MUST distinguish waiting for evidence, processing, quota, unavailable models, rejected lessons, and disabled execution. SSE heartbeats MUST NOT count as learning events or advance the graph.

#### Scenario: Empty event history
- **WHEN** no events exist but the worker has checked for evidence
- **THEN** the initial snapshot reports the actual scheduler state and the UI explains why no lesson was added

#### Scenario: Browser closed
- **WHEN** the monitoring page closes
- **THEN** the Railway worker continues independently and reopening the page shows persisted results

#### Scenario: Accessible status
- **WHEN** the page is viewed narrowly, by keyboard, or with reduced motion
- **THEN** textual stage, timestamps, limits and timeline remain readable without relying on animation or color
