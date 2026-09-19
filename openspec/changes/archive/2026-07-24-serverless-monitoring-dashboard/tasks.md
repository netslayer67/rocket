## 1. Backend monitoring contract

- [x] 1.1 Add normalized monitoring event types and metadata-only mappers for jobs, AI runs, feedback, learning logs, knowledge, and analytics.
- [x] 1.2 Add `MonitoringModule`, `MonitoringService`, and controller endpoints for 24-hour history, bounded SSE, retry, reindex, and learning actions.
- [x] 1.3 Export the existing narrative job and learning services needed by confirmed monitoring actions without adding a queue or dependency.
- [x] 1.4 Add unit tests for empty history, changed-state activity, heartbeat-only idle streams, payload redaction, and action confirmation boundaries.

## 2. Monitoring web surface

- [x] 2.1 Add shared monitoring types and API/SSE client helpers.
- [x] 2.2 Add the `/monitoring` route with a responsive workflow graph whose active state comes only from normalized events.
- [x] 2.3 Add the 24-hour summary, live connection status, accessible event timeline, and confirmation-gated action controls.
- [x] 2.4 Add reduced-motion, keyboard, narrow viewport, error, reconnect, and idle states using existing Tailwind primitives.

## 3. Contract and regression verification

- [x] 3.1 Add OpenSpec/API smoke coverage for history, SSE activity/heartbeat behavior, and each operator action.
- [x] 3.2 Run `npm run check:lines`, `npm test`, `npm run build`, and `openspec validate --all --strict`.
- [x] 3.3 Record the anti-slop review for `/monitoring` and archive the completed OpenSpec change.
