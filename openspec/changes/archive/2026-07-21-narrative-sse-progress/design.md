## Context

`POST /narratives/generate` currently performs the full AI and Mongo write before returning. The web form therefore has only an estimated timer and cannot distinguish server stages. The existing `NarrativesService` already owns generation, review, and persistence; the existing queue already accepts a persisted draft immediately.

## Goals / Non-Goals

**Goals:**

- Return a UUID job identifier without waiting for generation.
- Stream a small, named lifecycle through a native NestJS SSE endpoint.
- Save the draft before emitting `complete`, then let the web queue prepend it.
- Preserve the existing DTO, `narratives` collection, reviewer gate, and manual approval boundary.

**Non-Goals:**

- No BullMQ/Redis, new collection, dependency, automatic publishing, replay database, or cross-instance delivery guarantee.
- Reference suggestions keep their existing estimated progress path.

## Decisions

1. Add an in-process `NarrativeJobService` using `ReplaySubject<MessageEvent>` per UUID. The replay buffer lets a browser that opens just after POST still receive the latest lifecycle event. A small bounded map is cleaned after completion/error.
2. Keep `NarrativesService.generate` as the synchronous worker used by tests and the job runner. The controller adds `POST /narratives/generate` job creation and `GET /narratives/jobs/:jobId/events` SSE; the worker emits stage events around the existing call.
3. Use native browser `EventSource`. The form POSTs JSON, opens the stream with the returned jobId, updates its progress from event data, and resolves with the saved narrative on `complete`.
4. Emit JSON data with `stage`, `progress`, `message`, and optional `narrative` or `error`. The server never emits raw prompts, source text, or secrets.

## Risks / Trade-offs

- [Single-process registry] A server restart or another Vercel instance loses an active stream → show a clear error and retain the manual refresh fallback; move the registry to BullMQ/Redis when durable multi-instance jobs are required.
- [Long-lived HTTP connection] A proxy may close idle streams → emit each stage immediately and close after `complete` or `error`.
- [Duplicate completion] Reconnects may replay the last event → the client de-duplicates by narrative `_id`.
