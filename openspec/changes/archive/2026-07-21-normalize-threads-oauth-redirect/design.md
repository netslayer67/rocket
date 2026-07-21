## Context

The NestJS `ThreadsController` handles the production callback at `/api/threads/callback` and redirects the browser to the configured Next.js dashboard. Vercel environment values can contain an accidental newline when pasted. Node's HTTP server rejects that value in the `Location` header. The affected API contract is the existing Threads OAuth callback; MongoDB, Qdrant, and the frontend remain unchanged.

## Goals / Non-Goals

**Goals:**

- Make callback success and error redirects header-safe.
- Preserve the existing OAuth state, token exchange, encryption, and manual-publish boundary.
- Cover the failure with a small unit test.

**Non-Goals:**

- No new redirect endpoint or dependency.
- No change to Threads permissions, token storage, or dashboard behavior.

## Decisions

- Normalize `WEB_ORIGIN` at the single `dashboardUrl` boundary with `trim()` and trailing-slash removal. This fixes every callback outcome in one place; changing each caller would duplicate the guard.
- Keep the existing redirect-based error flow. Returning a new JSON error contract would require frontend changes and would not help the browser OAuth flow.
- Add a controller test using a whitespace-padded origin and assert the exact clean redirect URL.

## Risks / Trade-offs

- [Malformed non-whitespace origins] → They remain configuration errors and can still be rejected by the browser; Vercel should keep `WEB_ORIGIN` as the known HTTPS web origin.
- [Serverless state isolation] → The existing in-memory OAuth state remains unchanged; a successful callback already demonstrated the current deployment path works for this test.

## Migration Plan

1. Apply the controller normalization and test.
2. Run line checks, tests, and builds.
3. Deploy the API to Vercel production.
4. Retry OAuth from a fresh browser tab; rollback to the previous deployment if verification fails.

## Open Questions

None.
