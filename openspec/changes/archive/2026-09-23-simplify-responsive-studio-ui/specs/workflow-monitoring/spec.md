## MODIFIED Requirements

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
