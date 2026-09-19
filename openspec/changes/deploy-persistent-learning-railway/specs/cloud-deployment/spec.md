## MODIFIED Requirements

### Requirement: Vercel web and Railway API deployment

The system SHALL deploy the Next.js dashboard from the shared repository as a Vercel project and the NestJS API as one persistent Railway service, with the dashboard configured to reach the Railway API through a restricted CORS origin.

#### Scenario: Online dashboard requests the Railway API

- **WHEN** a creator opens the production dashboard after cutover
- **THEN** its configured public API URL reaches the Railway API routes with CORS restricted to the deployed dashboard origin

#### Scenario: Railway API is not ready

- **WHEN** the Railway health check or read-only verification fails before cutover
- **THEN** the dashboard remains configured for the prior Vercel API and no Threads callback origin is changed

### Requirement: Deployment secret boundary

The system SHALL store database, AI, Qdrant, Threads, encryption, and scheduler credentials only in server-side Railway or Vercel environment settings and SHALL not commit them to the repository or expose them to the frontend bundle.

#### Scenario: Railway production environment is configured

- **WHEN** the API is deployed to Railway
- **THEN** server-only credentials are available only to the Railway API process and the frontend receives only `NEXT_PUBLIC_API_URL`
