## Why

Production OAuth callbacks can fail with HTTP 500 when `WEB_ORIGIN` contains a trailing newline or other whitespace. Node rejects the resulting `Location` header, hiding the real connection result from the creator even after Threads has issued an authorization code.

## What Changes

- Normalize the configured dashboard origin before building OAuth callback redirects.
- Keep callback failures as safe dashboard redirects instead of invalid-header server errors.
- Add focused regression coverage for whitespace-padded origins.
- Keep token exchange, encryption, and manual-publish boundaries unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `threads-connection`: OAuth callback redirects must use a normalized, header-safe dashboard origin.

## Impact

- Affects `apps/api/src/threads/threads.controller.ts` and its unit tests.
- Requires redeploying the API after the code/config fix.
- No new dependency, database migration, API route, or frontend change.
- The manual approval boundary remains unchanged: connecting an account never publishes content.
