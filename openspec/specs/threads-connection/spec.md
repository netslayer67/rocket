# Threads Connection

## Purpose

Define the single-account Threads OAuth boundary that prepares a creator account without handling account passwords or publishing content.
## Requirements
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

### Requirement: Protected connection record
The system SHALL persist only one connection's encrypted access token, Threads account ID, expiry, and timestamps, and SHALL expose no token material through its API.

#### Scenario: Authorization succeeds
- **WHEN** Threads returns a valid authorization code and matching OAuth state
- **THEN** the system exchanges and encrypts the access token, stores the connection record, and redirects to the dashboard

#### Scenario: Connection status is requested
- **WHEN** the dashboard requests Threads status
- **THEN** the API returns configuration, connection, account ID, and expiry state without token material

### Requirement: Manual-publish boundary
Connecting or disconnecting a Threads account SHALL not publish, schedule, modify, or delete any Threads content. Publishing is allowed only through a separate explicit action for an approved narrative.

#### Scenario: Creator completes connection
- **WHEN** the OAuth callback succeeds
- **THEN** the system stores connection metadata only and publishes no external content

#### Scenario: Creator explicitly publishes approved narrative
- **WHEN** the creator invokes the publish action for an approved narrative with a valid connection
- **THEN** the system may publish that single text narrative and records the external publication ID

### Requirement: Header-safe OAuth callback redirect
The system SHALL trim surrounding whitespace from the configured dashboard origin before returning an OAuth callback redirect, so both successful and failed callbacks produce a valid `Location` header.

#### Scenario: Callback uses whitespace-padded dashboard origin
- **WHEN** Threads returns an authorization code and `WEB_ORIGIN` contains surrounding whitespace
- **THEN** the API redirects to the trimmed dashboard origin with the `threads=connected` result and does not return an invalid-header error

#### Scenario: Callback failure uses the same safe origin
- **WHEN** token exchange or persistence fails and `WEB_ORIGIN` contains surrounding whitespace
- **THEN** the API redirects to the trimmed dashboard origin with the `threads=error` result and does not return HTTP 500 due to the redirect header

