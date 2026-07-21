## Why

Generation currently waits for one HTTP response and the progress indicator is only a client estimate. A creator cannot see backend progress or receive a draft through a server-pushed completion event, which makes a slow generation look idle and undermines the no-refresh review workflow.

## What Changes

- Add a bounded SSE generation job flow that returns a `jobId` immediately.
- Stream named progress events for queued, generating, reviewing, saved, complete, and error states.
- Persist the draft before emitting the complete event.
- Subscribe from the browser with native `EventSource` and prepend the returned draft to the review queue without a page refresh.
- Keep manual approval unchanged; SSE only reports generation and persistence state.
- Keep a clear error path when the stream closes or the job fails.

Non-goals: BullMQ/Redis, automatic publishing, cross-instance job recovery, replay history, or a new frontend dependency. This V1 implementation is bounded to the current API process and one active generation per browser.

## Capabilities

### New Capabilities

- `narrative-sse-generation`: Native SSE job lifecycle and browser completion handling.

### Modified Capabilities

- `narrative-queue-reliability`: Queue receives the draft from the SSE completion event and keeps it visible without refresh.
- `narrative-studio-ui`: Generation uses a job stream, exposes server-reported status, and retains accessible pending/error states.
- `action-progress`: Backend progress replaces the estimate when a generation job is active; the reference-suggestion estimate remains unchanged.

## Impact

Affected API narrative controller/service and in-process job coordination, web narrative hook/form/queue, and the narrative queue, studio UI, and action-progress OpenSpecs. No new dependency or database collection is required; drafts continue using the existing `narratives` schema and manual-review boundary.
