## Context

Rocket already persists compact job events, AI run telemetry, feedback, learning logs, knowledge metadata, and manual analytics. The web app has no unified monitoring surface. The deployment target is serverless, so an always-on worker and synthetic agent traffic are out of scope.

## Goals / Non-Goals

**Goals:**

- Add `GET /monitoring/history` for a bounded 24-hour snapshot.
- Add `GET /monitoring/events` as a short-lived SSE stream that polls MongoDB, emits activity only when persisted state changes, and sends connection heartbeats separately.
- Add confirmation-gated retry, reindex, and approved-learning actions.
- Add a responsive `/monitoring` page with a workflow graph, live status, and event timeline.

**Non-Goals:**

- No new queue, worker, event collection, model calls, or external dependency.
- No synthetic activity, autonomous publishing, silent DNA promotion, or raw prompt/source exposure.
- No attempt to make Vercel serverless functions behave like a permanent process.

## Decisions

1. **Derive events from existing collections.** `MonitoringService` reads `jobs`, `airuns`, `feedback`, `learninglogs`, `knowledge`, and `analytics`; this avoids a new write path and keeps the event surface metadata-only.
2. **Poll inside a bounded SSE connection.** A five-second poll detects new database state; a heartbeat reports connection health but is not rendered as agent activity. The stream closes after a configurable short window so serverless instances can terminate.
3. **Use a fixed workflow topology with data-driven state.** The UI shows Input → Agents → Models → Learning as a readable map. Nodes and edges become active only when matching persisted events exist; idle state is explicit.
4. **Reuse native browser controls.** `window.confirm`, semantic buttons, existing Tailwind classes, and a timeline fallback avoid a new graph or dialog dependency.

## Risks / Trade-offs

- [Polling cost] → Limit queries to 24 hours and 100 compact events, poll at five seconds, and close the SSE stream after the configured window.
- [Serverless disconnects] → The client reconnects with exponential-free bounded retries and always keeps the last history snapshot visible.
- [Derived event timing] → Collection timestamps and job sequence numbers are used; raw nested payloads are discarded before the API response.
- [Graph accessibility] → The same event set is rendered as a keyboard-readable timeline; graph decoration never carries unique information.

## Migration Plan

Deploy the API and web changes together. Existing collections require no migration. If monitoring fails, remove the route or unset the API URL; narrative generation, learning, and publishing remain unchanged.

## Open Questions

None for serverless mode. A persistent worker, durable event log, or continuous 24/7 learning process requires a separate architecture change.
