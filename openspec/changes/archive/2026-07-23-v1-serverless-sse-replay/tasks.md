## 1. Shared job state

- [x] 1.1 Add the Mongo `NarrativeJob` schema and register it in `NarrativesModule`.
- [x] 1.2 Persist queued/progress/terminal events and atomically claim job start.

## 2. Serverless SSE contract

- [x] 2.1 Make the POST return a persisted `jobId` and let SSE trigger the runner after queued replay.
- [x] 2.2 Add deterministic Vercel narrative route wrappers and preserve manual review/publish boundaries.
- [x] 2.3 Prevent duplicate replay events and keep sequence order stable across instances.

## 3. Verification

- [x] 3.1 Update async job tests and regression smoke coverage for saved-before-complete.
- [x] 3.2 Run `npm run check:lines`, API tests, and API/web builds.
- [x] 3.3 Verify production POST → SSE terminal event and confirm a draft appears in Mongo/UI polling.
