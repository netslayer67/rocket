## ADDED Requirements

### Requirement: Organic workflow visualization
The web monitoring map SHALL present signals, agents, models, and memory as a responsive neural-flow hierarchy with curved and branched connectors instead of a single straight connector.

#### Scenario: Map renders with history
- **WHEN** `/monitoring` receives a 24-hour snapshot
- **THEN** the map renders the bounded stage hierarchy, event-derived node labels, and curved connector paths without adding raw source text

#### Scenario: Map is idle
- **WHEN** the snapshot contains no event in the recent activity window
- **THEN** nodes and wires remain muted, the map states that it is idle, and no animation implies live work

### Requirement: Event-backed flow state
The map SHALL emphasize only the nodes and paths whose stage is represented by a recent persisted event, while retaining historical events in the timeline.

#### Scenario: Activity arrives
- **WHEN** an SSE activity snapshot includes a recent job, agent, model, feedback, learning, knowledge, or analytics event
- **THEN** the matching node and related curved paths receive an active visual state and the map status remains text-readable

#### Scenario: Activity ages out
- **WHEN** the event is older than the recent activity window
- **THEN** its node and paths return to idle styling without removing the event from history

### Requirement: Accessible responsive fallback
The map SHALL keep node names and state available to assistive technology and remain usable on narrow viewports and with reduced motion.

#### Scenario: Narrow viewport
- **WHEN** the map is viewed below the desktop canvas width
- **THEN** the workflow remains reachable through bounded horizontal scrolling and the event timeline preserves a linear readable alternative

#### Scenario: Reduced motion
- **WHEN** the user prefers reduced motion
- **THEN** flow particles and pulses are disabled while state remains communicated by text, color, and node labels
