## Why

Vercel functions do not stay alive long enough for the in-process learning timer to be a reliable daily scheduler. Serverless mode therefore needs a platform-triggered learning endpoint so approved feedback can be processed without waiting for a user request.

## What Changes

- Add an authenticated GET cron endpoint for approved feedback learning.
- Configure an hourly Vercel cron trigger; the learning service remains bounded and idempotent.
- Require `CRON_SECRET` and reject unauthenticated invocations.
- Keep publishing, outcome promotion, and raw source handling unchanged.

## Capabilities

### New Capabilities

- `serverless-learning-cron`: Authenticated scheduled learning for serverless deployments.

### Modified Capabilities

- `feedback-learning`: Add a platform cron trigger alongside manual and in-process triggers.

## Impact

- API: one GET endpoint and a secret check in the existing feedback controller.
- Deployment: `apps/api/vercel.json` receives a cron schedule and `.env.example` documents `CRON_SECRET`.
- No database migration, queue, dependency, or change to the manual publishing boundary.
