## Context

`ThreadsService` currently stores generated OAuth states in a process-local `Map`. Vercel serverless functions do not guarantee that the callback runs in the same process as the connect request. The browser already receives the state in an HttpOnly cookie with a ten-minute lifetime, so the map duplicates state and creates a deployment-only failure mode.

## Goals / Non-Goals

**Goals:**

- Make state validation independent of serverless instance affinity.
- Preserve the existing cookie, TTL, and callback API contract.
- Keep the OAuth state comparison required for CSRF protection.

**Non-Goals:**

- No Redis or MongoDB state collection.
- No change to token exchange, encryption, or publish behavior.

## Decisions

- Compare the callback `state` query value directly with the `threads_oauth_state` cookie value. The cookie is HttpOnly, Secure in production, SameSite=Lax, and expires after ten minutes, so it is the existing minimal state store.
- Remove the in-memory map and cleanup loop. A distributed cache would add infrastructure for a value that already has a browser-bound storage path.
- Keep the callback's existing error redirect when values are absent or unequal.

## Risks / Trade-offs

- [Cookie loss or expiry] → OAuth is rejected and the creator can start a fresh connection; this is safer than accepting an unbound state.
- [Concurrent connection tabs] → The latest cookie wins; a single-account V1 connection flow does not need multi-tab state storage.

## Migration Plan

1. Remove process-local state tracking and update tests.
2. Run checks and build the monorepo.
3. Deploy the API to Vercel production.
4. Start a fresh OAuth flow and verify `/api/threads/status` reports the connection.

## Open Questions

None.
