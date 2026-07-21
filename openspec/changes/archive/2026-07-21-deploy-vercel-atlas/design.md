## Context

The repository is an npm-workspace monorepo: `apps/web` is Next.js and `apps/api` is NestJS. The current API starts a long-lived listener, which is unsuitable for a Vercel Function. MongoDB currently uses the local `rocket` database; Atlas will become the test-data source.

## Goals / Non-Goals

**Goals:**

- Deploy the web app and API as separately addressable Vercel projects from one repository.
- Reuse `AppModule`, validation, CORS, and controllers in a cached serverless handler.
- Copy existing local Rocket collections to Atlas, then verify source and destination counts.

**Non-Goals:**

- Deploying MongoDB, Qdrant, Scrapy, or Nutch to Vercel; automatic publishing; creating a custom domain; or changing production content behavior.

## Decisions

- Use two Vercel projects. The web project has root `apps/web`; the API project has root `apps/api`. This matches Vercel monorepo deployment boundaries and avoids a proxy or mixed runtime.
- Add one serverless entry that bootstraps the existing Nest `AppModule` once per warm function. Shared application configuration is extracted from `main.ts`; no second route implementation is created.
- Use a one-time Node migration script launched locally with Mongoose, rather than adding MongoDB Database Tools. It copies only known Rocket collections, preserves documents, and reports counts without logging content.
- Store all runtime secrets in Vercel production environment variables. The web app receives only the public API URL.

## Risks / Trade-offs

- [Atlas network access may reject Vercel] → verify Atlas connectivity before deployment; the user must allow the Vercel runtime through Atlas network access.
- [Cold starts] → reuse the function bootstrap promise; V1 test traffic is small.
- [Threads callback still points locally] → leave Threads disconnected until its exact deployed callback URI is registered in Meta.
- [One-time migration cannot capture later local writes] → migrate after local testing pauses; Atlas becomes the online test source.

## Migration Plan

1. Add and locally test the serverless entry.
2. Verify local and Atlas access, then copy collections and compare counts.
3. Deploy API, set API production environment variables, and record its URL.
4. Deploy web with the API URL, update API CORS with the web URL, then redeploy API.
5. Smoke-test dashboard and API endpoints; rollback by redeploying the previous Vercel deployment and pointing local configuration back to local Mongo.

## Open Questions

- Atlas IP access must allow Vercel before remote requests can succeed.
