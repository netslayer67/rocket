## Purpose

Define the production hosting, data migration, and secret boundaries for Rocket Project.

## Requirements

### Requirement: Vercel web and API deployment

The system SHALL deploy the Next.js dashboard and NestJS API from the same repository as separate Vercel projects, and the API SHALL expose the existing controller routes through a Node.js serverless function.

#### Scenario: Online dashboard requests the API

- **WHEN** a creator opens the production dashboard
- **THEN** its configured public API URL reaches the deployed API routes with CORS restricted to the deployed dashboard origin

### Requirement: Atlas test-data migration

The system SHALL copy the known Rocket collections from the local `rocket` database to the configured Atlas `rocket` database and SHALL report source and destination document counts without logging document content or credentials.

#### Scenario: Migration succeeds

- **WHEN** local MongoDB and Atlas are reachable with valid credentials
- **THEN** the destination contains the migrated Rocket collection documents and the count report matches the source

### Requirement: Deployment secret boundary

The system SHALL store database, AI, Qdrant, Threads, and encryption credentials only in Vercel environment settings and SHALL not commit them to the repository or expose them to the frontend bundle.

#### Scenario: Production environment is configured

- **WHEN** the API is deployed to Vercel
- **THEN** server-only credentials are available only to the API function and the frontend receives only `NEXT_PUBLIC_API_URL`
