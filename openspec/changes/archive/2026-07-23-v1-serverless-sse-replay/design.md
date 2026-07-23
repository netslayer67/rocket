## Context

The Next.js client submits `POST /api/narratives/generate`, then opens `GET /api/narratives/events?jobId=...`. Vercel may route those requests to different NestJS instances, while the previous job map existed only in process memory. The API already uses MongoDB for narratives and compact knowledge metadata, so the smallest shared state is a `jobs` document.

## Goals / Non-Goals

**Goals:**

- Make the existing `POST`/SSE contract work across Vercel instances.
- Persist ordered lifecycle events and start generation once per job.
- Ensure the `saved` event is emitted before `complete` and the draft is persisted before completion.
- Keep event payloads compact and free of raw imported source text.

**Non-Goals:**

- No BullMQ/Redis queue, scheduler, retry worker, or automatic publisher.
- No change to Threads OAuth or the manual approval boundary.

## Decisions

1. **Mongo `jobs` document.** `NarrativeJobSchema` stores `jobId`, DTO payload, an array of `{sequence,type,data}` events, `startedAt`, and `completedAt` in the existing Mongo database. This avoids a dependency and matches the V1 Ponytail ceiling; a queue is deferred to V2.
2. **SSE-triggered start.** `POST` creates and persists the queued event. The SSE handler replays that event, atomically claims `startedAt`, then invokes `NarrativeJobRunner`. This prevents a fire-and-forget runner from being killed when the POST function returns.
3. **Replay with bounded polling.** The SSE instance polls the compact job record, emits unseen events in sequence order, and closes on completion. The bounded window returns a safe error for expired jobs rather than holding a function forever.
4. **Explicit Vercel route wrappers.** `generate.ts`, `events.ts`, `index.ts`, and action wrappers re-export the common Nest handler so route matching is deterministic without a catch-all conflict.

## Risks / Trade-offs

- [Risk] Mongo event arrays grow with long-running jobs → [Mitigation] V1 emits only five compact lifecycle events and cleans local streams; move to a queue/event store when scheduling arrives.
- [Risk] A provider failure still yields a terminal error → [Mitigation] SSE exposes the error and the UI keeps the form editable; no silent draft is shown.
- [Risk] Polling costs reads → [Mitigation] 250 ms interval and bounded attempts; replace with durable workers in V2.
