## 1. API job stream

- [x] 1.1 Add the in-process narrative job registry with bounded replay, stage events, cleanup, and a safe error payload.
- [x] 1.2 Add job creation and SSE event routes, and run the existing narrative generation worker with queued/generating/reviewing/saved/complete events.
- [x] 1.3 Add focused API tests for event ordering, saved-before-complete, unknown jobs, and failure handling.

## 2. Browser stream

- [x] 2.1 Add typed job/SSE helpers using native `EventSource` and no new dependency.
- [x] 2.2 Update the studio hook and form to open the stream, render server stage/progress, close it on terminal events, and prepend the completed draft.
- [x] 2.3 Preserve suggestion estimates, accessible status, duplicate-submit protection, and de-duplication of repeated completion events.

## 3. Verification and handoff

- [x] 3.1 Run `npm run check:lines`, `npm test`, and `npm run build`.
- [x] 3.2 Sync delta specs into `openspec/specs/` and archive the completed change.
