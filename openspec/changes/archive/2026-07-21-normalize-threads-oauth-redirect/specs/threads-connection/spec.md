## ADDED Requirements

### Requirement: Header-safe OAuth callback redirect
The system SHALL trim surrounding whitespace from the configured dashboard origin before returning an OAuth callback redirect, so both successful and failed callbacks produce a valid `Location` header.

#### Scenario: Callback uses whitespace-padded dashboard origin
- **WHEN** Threads returns an authorization code and `WEB_ORIGIN` contains surrounding whitespace
- **THEN** the API redirects to the trimmed dashboard origin with the `threads=connected` result and does not return an invalid-header error

#### Scenario: Callback failure uses the same safe origin
- **WHEN** token exchange or persistence fails and `WEB_ORIGIN` contains surrounding whitespace
- **THEN** the API redirects to the trimmed dashboard origin with the `threads=error` result and does not return HTTP 500 due to the redirect header
