## MODIFIED Requirements

### Requirement: Official Threads account connection
The system SHALL initiate Meta Threads OAuth authorization-code authentication, SHALL bind the callback to the HttpOnly state cookie, and SHALL never accept, persist, or log a Threads email or password.

#### Scenario: Creator starts account connection
- **WHEN** the creator selects Connect Threads and OAuth configuration is valid
- **THEN** the system redirects the creator to the official Threads authorization screen with a short-lived state value stored in an HttpOnly cookie

#### Scenario: OAuth configuration is incomplete
- **WHEN** the creator tries to connect without the required Meta application configuration
- **THEN** the system reports that configuration is required and does not redirect

#### Scenario: Callback runs on another serverless instance
- **WHEN** Threads returns a state value matching the HttpOnly state cookie on a different API instance
- **THEN** the system accepts the state and continues the authorization-code exchange

#### Scenario: Callback state is missing or mismatched
- **WHEN** the callback state is absent or differs from the HttpOnly state cookie
- **THEN** the system rejects the callback and does not exchange or persist a token
