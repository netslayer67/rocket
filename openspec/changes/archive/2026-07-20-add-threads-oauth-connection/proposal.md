## Why

Creators need a safe way to connect their own Threads account for later manual-publish testing. Password-based automation would expose account credentials and bypass the platform's supported authorization flow.

## What Changes

- Add a single-account Threads OAuth connection flow using Meta's authorization-code flow.
- Persist only encrypted access-token material, account ID, expiry, and connection status in MongoDB; never store an email or password.
- Add a dashboard connection status and a button that sends the creator to Threads' official authorization screen.
- Keep V2's manual-approval boundary intact: connecting an account does not publish anything.

## Capabilities

### New Capabilities

- `threads-connection`: Connect, display, and disconnect the creator's Threads account through OAuth without handling account passwords.

### Modified Capabilities

- None.

## Impact

- Adds a small NestJS Threads module, a MongoDB connection record, dashboard status UI, and Meta OAuth environment variables.
- Uses Node's built-in crypto and existing dependencies; no new package is required.
