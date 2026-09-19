## Context

Rocket currently runs its dashboard and API on Vercel. The API has an idempotent `LearningService` with a configurable in-process interval, but Vercel function instances are not durable enough for that interval. Vercel Cron is a safe scheduled fallback but runs only hourly. Railway provides a persistent container suited to the existing NestJS API process.

Affected apps are `apps/api` and the Vercel-hosted `apps/web`; no MongoDB schemas change. The only new API contract is an unauthenticated `GET /health` liveness response for Railway deployment checks. Existing feedback, learning, knowledge, and Threads routes retain their contracts.

## Goals / Non-Goals

**Goals:**

- Run the existing API as one persistent Railway service and enable its existing learning interval at 60 seconds.
- Keep the learning runner bounded, idempotent, and restricted to feedback explicitly approved for learning.
- Make the Railway deployment reproducible from the monorepo and safe to cut over from the existing Vercel API.

**Non-Goals:**

- Adding a queue, a separate worker, a database, automatic analytics ingestion, or automatic approval/publishing.
- Moving the Next.js dashboard from Vercel or persisting new/raw data.
- Claiming that a Railway service is deployed before an authenticated operator connects the repository and supplies secrets.

## Decisions

- **Run the NestJS API itself as the persistent service.** Its existing scheduler starts with the API process, so a second worker service would duplicate infrastructure and violate the project Ponytail ceiling. A single Railway replica is required for this V1 interval; the existing learning log remains the durable idempotency record.
- **Use a 60-second interval through Railway variables.** The existing service already clamps intervals to at least 60 seconds. This is near-realtime while bounding database and embedding work; feedback approved in its create request still learns immediately through the current path.
- **Add `GET /health` rather than reuse a domain route.** The simple route proves that Nest has started without exposing account state or triggering learning. Railway waits for it before routing the deployment.
- **Keep configuration in `railway.json` at the repository root.** This is a shared npm workspace, so its build and start commands run from the root with the API workspace selected. Railway's Vercel-facing frontend is not imported as a second Railway service.
- **Keep Vercel configuration untouched for rollback.** After Railway receives a public domain, `NEXT_PUBLIC_API_URL`, `WEB_ORIGIN`, `CORS_ORIGINS`, and the Threads callback must be changed deliberately. Secrets are entered only in Railway/Vercel settings, never committed.

## Risks / Trade-offs

- [Railway service sleeps or has multiple replicas] → Use a non-sleeping persistent plan and one replica; scale only after replacing the in-process scheduler with a durable distributed mechanism.
- [Bad cutover CORS or OAuth URL] → Verify `/health` and `/threads/status` on Railway first, then update the Vercel web environment and Meta callback; retain the Vercel API as rollback.
- [A learning run exceeds its interval] → The existing runner remains capped at 20 pending records and uses idempotent learning logs; keep the 60-second minimum and investigate measured backlog before adding infrastructure.
- [Missing Railway secrets] → Deployment health check can start only once all server-side variables point to the production MongoDB/Qdrant/OpenRouter/Threads configuration.

## Migration Plan

1. Deploy one Railway service from the repository using `railway.json`, with no volume and one replica.
2. Add the existing server-side variables in Railway plus `LEARNING_SCHEDULER_ENABLED=true` and `LEARNING_INTERVAL_MS=60000`.
3. Generate a Railway domain and verify `/health`, a read-only API route, and Railway logs.
4. Set `NEXT_PUBLIC_API_URL` in Vercel to the Railway API origin; set Railway `WEB_ORIGIN` and `CORS_ORIGINS` to the Vercel web origin.
5. Update Meta's valid OAuth redirect and Railway `THREADS_REDIRECT_URI`, then reconnect Threads if its callback origin changed.
6. Disable Vercel Cron only after Railway learning activity is verified; roll back by restoring the previous Vercel web API URL and cron configuration.

## Open Questions

- Which Railway plan/project will keep the service awake continuously is an operator account decision.
- The Railway domain is unknown until the authenticated deployment is created.
