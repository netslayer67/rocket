## Why

The nested SSE URL works in a local Nest server but Vercel's current function routing returns an edge 404 for multiple path segments. Production therefore accepts a generation job but cannot open its event stream.

## What Changes

- Expose the same job stream at `GET /narratives/events?jobId=...`, which stays within the deployed route shape.
- Update the browser EventSource URL and the API contract.
- Keep the job lifecycle, payloads, manual approval, and in-process limitation unchanged.

Non-goals: new queue infrastructure, a second stream implementation, or automatic publishing.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `narrative-sse-generation`: Use the Vercel-compatible stream URL.

## Impact

The Nest narratives controller, web SSE helper, OpenSpec narrative SSE contract, and deployment verification are affected. No database schema or dependency changes are required.
