## Context

The existing `LearningService` is idempotent and already processes only explicitly approved feedback. Its `setInterval` is process-local, so it is not dependable on Vercel serverless functions.

## Goals / Non-Goals

**Goals:**

- Provide `GET /learning/cron` for Vercel Cron.
- Authenticate with `Authorization: Bearer $CRON_SECRET`.
- Reuse `FeedbackService.run()` and return its bounded counts.

**Non-Goals:**

- No automatic publishing, silent DNA promotion, new queue, or new worker.

## Decisions

Use the native Vercel Cron request shape and a standard bearer secret. A missing or mismatched secret returns unauthorized. The schedule runs hourly; idempotency and the pending query prevent duplicate learning. Manual `/learning/run` remains available.

## Risks / Trade-offs

- [Cron misconfiguration] → Manual learning remains available and the endpoint returns a clear unauthorized response.
- [Hourly invocations] → The existing limit of 20 pending feedback items bounds each run.
