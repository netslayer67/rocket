## Context

`useStudio.run` currently calls `refresh()` after every mutation. `refresh()` uses one `Promise.all` for personas, knowledge, narratives, and Threads status; it has no request ordering. A generation response is therefore not applied directly, and an older refresh can overwrite a newer queue.

## Goals / Non-Goals

**Goals:**

- Make a successful generate response visible immediately.
- Ignore stale refresh results while retaining the current fallback state.

**Non-Goals:**

- No websocket, polling loop, cache library, or API change.
- No optimistic card before the API confirms persistence.

## Decisions

1. Let `run` accept an optional success handler. Generation uses the confirmed `Narrative` response to prepend a unique card and skips the broad refresh; other mutations retain their existing refresh behavior.
2. Add a monotonically increasing refresh request token in `useStudio`. Only the newest completed refresh may update all dashboard collections.
3. Keep the existing API error message and manual approval flow. If refresh fails after generation, the confirmed card remains visible and the failure remains observable through the existing status message.

## Risks / Trade-offs

- [Risk] Generation does not immediately refresh unrelated counters → those counters already derive from the same local narrative state; the manual “Segarkan data” control remains available.
- [Risk] A stale refresh may omit later server changes → request-token ordering prevents overwriting newer state; a manual refresh can reconcile it.

## Migration Plan

Update the hook, run the existing line/test/build checks, deploy the web app, and verify a generated card appears without a page reload.
