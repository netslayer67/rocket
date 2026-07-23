## Why

Threads OAuth state is currently kept only in a process-local memory map. That works in a single local process but is unreliable on Vercel, where `/connect` and `/callback` may run on different serverless instances. A valid callback can therefore be rejected before token exchange.

## What Changes

- Validate the OAuth callback state against the existing HttpOnly state cookie instead of process memory.
- Keep the ten-minute cookie lifetime and constant-time state equality boundary.
- Remove the process-local state map and its cleanup logic.
- Add regression coverage proving callback state validation works without shared process memory.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `threads-connection`: OAuth state validation must work across serverless instances while preserving CSRF protection.

## Impact

- Affects `apps/api/src/threads/threads.service.ts` and its tests.
- No database migration, new dependency, or API route.
- The connection remains metadata-only; no publishing or automatic approval behavior changes.
