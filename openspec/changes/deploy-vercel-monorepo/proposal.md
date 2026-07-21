## Why

Rocket currently runs only on local ports, which prevents external testing of the dashboard and API. The monorepo needs Vercel-compatible entry points and separate deployable frontend/API projects without exposing local environment files.

## What Changes

- Add a minimal Vercel serverless entry point for the existing Nest API and route all API paths to it.
- Deploy the Next.js dashboard and Nest API as two Vercel projects from the same repository.
- Configure production and preview environment variable names in Vercel, using managed cloud endpoints rather than localhost values.
- Document the required managed MongoDB, Qdrant, OpenRouter, CORS, and Threads callback configuration.

## Capabilities

### New Capabilities

- `vercel-deployment`: Online testing deployment for the web dashboard and API from the shared monorepo.

### Modified Capabilities

- None.

## Impact

Adds a serverless API handler and Vercel routing configuration, creates two Vercel projects, and configures deployment environment variables. Manual approval and no-auto-publishing rules are unchanged. A public managed MongoDB URI is required; local MongoDB cannot serve Vercel functions.
