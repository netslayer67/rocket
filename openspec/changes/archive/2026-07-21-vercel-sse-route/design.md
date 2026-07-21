## Context

The deployed API exposes separate Vercel functions for nested `api/*` folders. The current multi-segment SSE route is rejected before reaching Nest, while the generate endpoint works.

## Goals / Non-Goals

**Goals:**

- Keep one SSE implementation and make its URL match production routing.
- Preserve the existing job ID and event payload contract.

**Non-Goals:**

- Do not add rewrites, middleware, dependencies, or durable job storage.

## Decisions

Use `@Sse('events')` with `@Query('jobId')`. The browser sends the UUID as a query value. This is the smallest compatible route and remains identical locally and on Vercel.

## Risks / Trade-offs

- [Query typo] A missing or unknown ID returns a clear 404 → validate the query before looking up the stream.
- [In-process job] Multi-instance durability is still deferred → use BullMQ/Redis when production throughput requires it.
