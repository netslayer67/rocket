## Why

Long-running reference suggestions and narrative generation currently disable a button but provide no visible evidence that the backend is still working. Creators can mistake an active request for a broken interface.

## What Changes

- Add an animated, labelled, percentage-based estimated progress indicator for suggestion and narrative-generation requests.
- Change action-button copy while its request is running and show a short completion or failure state.
- Keep the progress estimator client-only; it does not claim backend stage telemetry or add polling, SSE, queues, or API changes.

## Capabilities

### New Capabilities

- `action-progress`: Provide accessible estimated progress feedback for long-running narrative form actions.

### Modified Capabilities

- `narrative-studio-ui`: Make narrative action state clear before a request completes.

## Impact

- Affects only the Next.js narrative form and a small pure progress helper with tests.
- No dependency, backend contract, persistence, publication, or streaming infrastructure change.
