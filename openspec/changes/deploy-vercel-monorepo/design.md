## Context

`apps/web` is a deployable Next.js application. `apps/api` is a long-running Nest application that currently listens on port 4000; Vercel needs a request handler instead. MongoDB, Qdrant, and OpenRouter are external dependencies, while the local MongoDB URI cannot be reached from Vercel.

Affected applications: `apps/web`, `apps/api`. MongoDB schemas and API routes remain unchanged. `NEXT_PUBLIC_API_URL` is the web build contract; API runtime configuration remains the existing environment names.

## Goals / Non-Goals

**Goals:**

- Deploy web and API as two Vercel projects from one repository.
- Reuse one Nest configuration path for local listening and the serverless handler.
- Keep deployment secrets in Vercel and configure public CORS/Threads URLs after Vercel assigns them.

**Non-Goals:**

- Docker deployment, crawler execution on Vercel, automatic publishing, a new database, or replacing managed MongoDB/Qdrant.

## Decisions

- Add a cached Node.js Vercel handler that initializes the existing Nest application once per warm function. It reuses controllers, validation, CORS, orchestration, and schemas; a second API implementation is rejected.
- Use two Vercel projects with roots `apps/web` and `apps/api`. This matches their independent build/runtime requirements and permits the browser to receive the API URL at build time.
- Add a simple Vercel rewrite so all API paths reach the Nest handler. No edge runtime or new dependency is necessary.
- Configure secrets with Vercel project environment variables only. Use the deployed web URL for `NEXT_PUBLIC_API_URL`, `WEB_ORIGIN`, and `CORS_ORIGINS`; use the deployed API callback for Threads.

## Risks / Trade-offs

- [No cloud Mongo URI] → deployment can be created and health-checked, but persistence endpoints cannot work; obtain an Atlas/managed URI before functional testing.
- [Serverless cold starts] → cache initialized Nest app per warm function; V1 testing accepts cold-start latency.
- [Threads redirect changes] → update Meta's valid OAuth callback URI to the deployed API callback before connecting.

## Migration Plan

1. Add the serverless handler and Vercel routing, then verify local tests/build.
2. Create/deploy API project, capture its production URL, and configure server runtime variables.
3. Create/deploy web project with that API URL, then update API CORS and Threads callback URL.
4. Verify `/threads/status`, the web dashboard, and browser CORS. Roll back by redeploying the prior commit or removing the Vercel projects; local development is unchanged.

## Open Questions

- A hosted MongoDB connection URI is required to complete online persistence testing.
