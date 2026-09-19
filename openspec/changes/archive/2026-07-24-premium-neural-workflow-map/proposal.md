## Why

The monitoring workflow map currently reads as four rigid columns with one straight connector, so it explains structure but not flow. A more organic neural-flow view will help operators see how persisted signals move through agents, models, and memory without implying activity that the server has not recorded.

## What Changes

- Replace the rigid column map with a responsive neural-flow canvas using curved, branched SVG wires and a clear signal-to-memory hierarchy.
- Keep active nodes, particles, and wire emphasis tied to recent persisted events; historical events remain visibly idle.
- Add compact legend/status text, accessible node labels, and a readable mobile fallback without adding a graph dependency.
- Preserve the existing timeline as the accessible event-by-event representation.
- Non-goals: simulated 24/7 activity, new monitoring APIs, new dependencies, or changes to SSE semantics.

## Capabilities

### New Capabilities

- `neural-workflow-map`: Render a responsive, event-backed neural workflow visualization with accessible fallback semantics.

### Modified Capabilities

- `workflow-monitoring`: Clarify that map geometry, active state, and motion are derived from persisted event recency while history remains available when idle.

## Impact

Affected code is limited to the web monitoring graph and its local styles/types, plus the OpenSpec/context review record. No API, database, queue, model, or publishing behavior changes. Manual approval and serverless bounded-stream limits remain unchanged.
