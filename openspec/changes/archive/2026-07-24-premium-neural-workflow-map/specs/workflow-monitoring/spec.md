## MODIFIED Requirements

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
