## Context

`AiOrchestratorService` sends interactive persona requests and background free-learning requests through the same OpenRouter endpoint with one 30-second timeout. Production telemetry shows the two current interactive candidates fail after their timeout windows, while the embedding route succeeds. The API contract currently reduces an all-candidate failure to the final rejection code.

## Goals / Non-Goals

**Goals:**
- Give one interactive persona candidate enough bounded time for a free-provider queue to respond.
- Preserve compact, safe failure telemetry and make the final error diagnostically useful.
- Keep background learning, embeddings, persisted data, and manual approval unchanged.

**Non-Goals:**
- Retrying indefinitely, adding a queue, bypassing provider quotas, returning demo content after a live-model failure, or exposing provider response bodies.

## Decisions

- Use a 75-second timeout only when `personaModels` is set. The existing 30-second timeout remains for embeddings and free-only learning, which protects scheduled work from consuming a request slot too long. A configuration knob would add an unneeded failure mode for one fixed operating boundary.
- Convert aborts to the safe `timeout` rejection code. Other local/network failures retain `request-error`.
- Retain the ordered distinct safe rejection codes from this one fallback run and append them to the existing unavailable-model exception. Individual candidate failures continue to be persisted in `AiRun`; neither exception nor telemetry includes provider bodies or prompt content.
- Limit the summary to configured candidates (at most four persona routes), so it stays compact and cannot leak model output.

## Risks / Trade-offs

- [A free provider is actually unavailable] → the request can take up to 75 seconds per candidate before failing. Use fewer than four persona fallbacks and show the safe summary; do not add automatic retry loops.
- [Provider returns 429] → the summary reports `http-429`; increasing timeout cannot bypass quota or capacity.
- [Long request meets an upstream connection limit] → the existing Mongo-backed SSE/job replay remains the delivery path; no new queue is introduced.
