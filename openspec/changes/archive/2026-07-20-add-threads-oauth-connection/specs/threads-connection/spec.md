## ADDED Requirements

### Requirement: Official Threads account connection
The system SHALL initiate Meta Threads OAuth authorization-code authentication and SHALL never accept, persist, or log a Threads email or password.

#### Scenario: Creator starts account connection
- **WHEN** the creator selects Connect Threads and OAuth configuration is valid
- **THEN** the system redirects the creator to the official Threads authorization screen with a short-lived state value

#### Scenario: OAuth configuration is incomplete
- **WHEN** the creator tries to connect without the required Meta application configuration
- **THEN** the system reports that configuration is required and does not redirect

### Requirement: Protected connection record
The system SHALL persist only one connection's encrypted access token, Threads account ID, expiry, and timestamps, and SHALL expose no token material through its API.

#### Scenario: Authorization succeeds
- **WHEN** Threads returns a valid authorization code and matching OAuth state
- **THEN** the system exchanges and encrypts the access token, stores the connection record, and redirects to the dashboard

#### Scenario: Connection status is requested
- **WHEN** the dashboard requests Threads status
- **THEN** the API returns configuration, connection, account ID, and expiry state without token material

### Requirement: Manual-publish boundary
Connecting or disconnecting a Threads account SHALL not publish, schedule, modify, or delete any Threads content.

#### Scenario: Creator completes connection
- **WHEN** the OAuth callback succeeds
- **THEN** the system stores connection metadata only and publishes no external content
