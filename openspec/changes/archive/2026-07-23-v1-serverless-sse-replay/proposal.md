## Why

Vercel can serve the POST that creates a generation job and the SSE request from different function instances. In-memory job state therefore caused missing jobs, duplicate progress, or drafts that never appeared in production. V1 needs a compact shared job record so the manual-review flow remains reliable without introducing a queue yet.

## What Changes

- Persist only job input, ordered progress events, start state, and completion state in MongoDB.
- Start generation when the SSE subscriber connects, after replaying the queued event.
- Replay events across function instances and keep event order stable; emit terminal `complete` or `error` events.
- Keep manual review and approval boundaries unchanged; no automatic publishing.
- Add regression coverage for persisted SSE lifecycle and production smoke verification.

Non-goals: BullMQ/Redis scheduling, durable retries, background learning, or raw source-text storage.

## Capabilities

### New Capabilities

- `serverless-sse-replay`: shared, ordered generation-job lifecycle for Vercel function instances.

### Modified Capabilities

- None.

## Impact

`NarrativeJobService`, the narratives controller/module, the Mongo `jobs` collection, explicit Vercel narrative route wrappers, and API regression tests. The frontend contract remains `POST /narratives/generate` followed by `GET /narratives/events?jobId=...`; approved drafts are still published only by explicit user action.
