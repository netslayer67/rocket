## Why

Rocket Project currently runs only against local services, preventing online testing. The frontend and API need independently deployable Vercel runtimes backed by the provided MongoDB Atlas cluster.

## What Changes

- Add a Vercel serverless entry point for the existing NestJS API without changing its public routes.
- Configure two Vercel projects from the monorepo: Next.js dashboard and API function.
- Move the local Rocket MongoDB data into Atlas and verify collection counts before directing the deployed API to it.
- Configure production environment variables without committing any credential, and use deployed URLs for frontend API access and CORS.

## Capabilities

### New Capabilities

- `cloud-deployment`: Online Vercel frontend/API deployment with production configuration and Atlas-backed test data.

### Modified Capabilities

- None.

## Impact

Adds a serverless API entry point and Vercel project configuration. It writes the provided data to Atlas and creates Vercel deployments. Manual narrative approval remains unchanged; Crawlers remain local operator tools and no secret is committed.
