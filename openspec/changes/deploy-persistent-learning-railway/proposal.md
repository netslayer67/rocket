## Why

Vercel can invoke the bounded learning runner on a schedule, but its serverless instances cannot keep the existing in-process interval alive. A persistent Railway API service lets Rocket process explicitly approved feedback continuously while retaining the existing manual approval and idempotency boundaries.

## What Changes

- Add Railway configuration for the existing NestJS API in this npm-workspace monorepo, including a lightweight health endpoint and persistent-process restart policy.
- Document the Railway API variables, deployment steps, CORS cutover, and Threads OAuth callback update while keeping the Next.js dashboard on Vercel.
- Configure the existing learning scheduler for Railway so it checks approved, unlearned feedback on a bounded short interval.
- Preserve the Vercel deployment as a rollback path until the Railway API is verified.

No queue, worker service, dependency, automatic publishing, or automatic analytics-to-DNA promotion is added.

## Capabilities

### New Capabilities

- `persistent-learning-runtime`: Run the existing idempotent learning runner continuously on a persistent service, only for feedback explicitly approved for learning.

### Modified Capabilities

- `cloud-deployment`: Allow the NestJS API to run as a Railway persistent service while the dashboard remains separately deployable.
- `feedback-learning`: Define the bounded continuous-learning trigger and its approval boundary.

## Impact

Affected areas are API bootstrap/health testing, Railway deployment configuration, environment documentation, and the deployment and learning specifications. Railway holds server-side configuration only; MongoDB, Qdrant, OpenRouter, and Threads credentials remain secret runtime variables, and the browser receives only the Railway API URL.
