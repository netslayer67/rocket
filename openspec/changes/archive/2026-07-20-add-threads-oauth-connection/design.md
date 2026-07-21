## Context

V2 has no user-auth system and does not publish to external platforms. The first platform integration therefore needs to support one local creator account while protecting its OAuth token and preserving manual approval.

## Goals / Non-Goals

**Goals:**

- Connect one Threads account with Meta's authorization-code flow.
- Store encrypted token material and expose non-secret connection status.
- Provide a small Tailwind status card and connection action.

**Non-Goals:**

- Password login, browser automation, publishing, token refresh jobs, or multiple accounts.

## Decisions

- A NestJS `threads` module owns OAuth endpoints and Mongo persistence. The dashboard opens its existing API URL; no new frontend dependency is needed.
- OAuth state is an opaque, short-lived value bound to an HTTP-only callback cookie and consumed once. A process restart simply requires restarting the connection flow.
- Access tokens are encrypted with Node `crypto` AES-256-GCM using a base64 environment key. Email and password are never accepted, logged, or stored.
- The initial scope defaults to `threads_basic`. Publishing permission is deferred until the V3 publisher exists, avoiding unnecessary access.
- One Mongo record uses a fixed key because V2 has no user accounts. A future multi-user model can add a user reference without changing the OAuth exchange boundary.

## Risks / Trade-offs

- [Meta app configuration is missing] → The UI reports configuration required and does not redirect.
- [In-memory OAuth state is lost on restart] → Restart the connection; use Redis only when horizontally scaling.
- [Encryption key rotation invalidates existing tokens] → Disconnect and reconnect; introduce versioned key rotation only when multiple accounts exist.
- [Token expiry] → Status exposes expiry; a refresh worker is deferred to V3 scheduling.

## Migration Plan

1. Add Meta app ID, secret, redirect URI, and a generated 32-byte base64 encryption key to the API environment.
2. Register the exact redirect URI in the Meta Threads app and authorize through the dashboard.
3. Roll back by removing the module and deleting the single `threadsconnections` record; no content is published.

## Open Questions

- The creator must provide the Meta Threads app ID and secret before a live connection can be tested.
