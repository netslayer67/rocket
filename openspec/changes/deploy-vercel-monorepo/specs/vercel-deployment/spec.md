## ADDED Requirements

### Requirement: Deployable Vercel API handler
The system SHALL expose the existing Nest API through a Node.js Vercel Function that applies the same validation and CORS configuration as local execution.

#### Scenario: API route reaches Vercel
- **WHEN** a request reaches a deployed API path
- **THEN** Vercel routes it to the Nest handler without starting a separate listening server

### Requirement: Separate web and API deployments
The system SHALL deploy the Next.js dashboard and Nest API as separate Vercel projects from the same repository and SHALL configure the dashboard with the deployed API origin.

#### Scenario: Dashboard calls deployed API
- **WHEN** a creator opens the production dashboard
- **THEN** browser requests use `NEXT_PUBLIC_API_URL` and the API permits that deployed dashboard origin through CORS

### Requirement: External configuration only
The system SHALL keep runtime secrets out of Git and SHALL require externally reachable managed service URLs for online persistence and vector functionality.

#### Scenario: Vercel receives environment configuration
- **WHEN** production configuration is added to Vercel
- **THEN** secrets are configured as project variables and no active `.env` file is included in the deployment repository

#### Scenario: Local MongoDB is configured
- **WHEN** `MONGODB_URI` points to localhost
- **THEN** the deployment setup identifies it as unsuitable for Vercel online persistence testing
