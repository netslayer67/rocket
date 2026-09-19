## Why

The dashboard needs an honest view of the last 24 hours of AI workflow activity. Today operators can inspect individual generation and learning actions, but they do not have one place to replay recent events or follow live server activity. A serverless-safe monitoring surface makes the workflow observable without pretending that agents run continuously when no backend work exists.

## What Changes

- Add a `/monitoring` dashboard showing persisted activity from the last 24 hours and live SSE events when work is active.
- Add a compact monitoring event contract covering jobs, AI runs, feedback learning, knowledge indexing, analytics, and model fallback.
- Expose a serverless-safe event stream that replays bounded history, emits heartbeats only as connection health, and closes cleanly after idle timeout.
- Add confirmation-gated controls for retrying a failed job, reindexing knowledge, and running approved learning feedback.
- Show agents and models as an interactive workflow graph backed by event state, with a readable event timeline fallback on narrow screens.
- Keep the page read-only by default and preserve the existing manual-approval boundary.

## Capabilities

### New Capabilities

- `workflow-monitoring`: Persisted 24-hour activity, serverless SSE updates, graph/timeline visualization, and explicit operator controls.

### Modified Capabilities

- `narrative-queue-reliability`: Expose compact job lifecycle events to the monitoring stream without changing generation semantics.
- `feedback-learning`: Expose approved learning and scheduled learning outcomes as monitorable events; no autonomous publishing or silent promotion.

## Impact

- Backend: monitoring event query/stream endpoints, bounded event normalization, and serverless-safe polling/heartbeat behavior.
- Frontend: new `/monitoring` route using existing Tailwind primitives, accessible graph/timeline states, and confirmation dialogs.
- Data: reuse existing `jobs`, `airuns`, `feedback`, `learninglogs`, `knowledge`, and `analytics` metadata; do not persist prompts, raw sources, or synthetic activity.
- Operations: cron may trigger existing learning work, but no always-on worker or new queue is introduced in this change.
