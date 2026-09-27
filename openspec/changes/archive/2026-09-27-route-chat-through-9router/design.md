## Context

Rocket's chat calls currently target OpenRouter directly; its embeddings also target OpenRouter and share Qdrant's existing vector dimension. The creator's 9Router tunnel is reachable and a direct `gemini/gemini-3.8-flash` request succeeds only when `stream: false` is explicit. Its content combo and several dynamic routes are currently unhealthy, and no embedding model is advertised.

## Goals / Non-Goals

**Goals:**
- Route interactive persona chat through 9Router when fully configured.
- Keep the same persona prompt, bounded fallback, output gate, safe telemetry, and manual-review boundary.
- Preserve the working OpenRouter embedding collection and existing free-only autonomous worker.

**Non-Goals:**
- 9Router dashboard/combo repair, tunnel hosting, automatic model discovery, provider quota bypass, multi-account routing, paid fallback, 9Router embeddings, or Qdrant reindexing.

## Decisions

- Add a small chat-route resolver used only by `AiOrchestratorService`. When both `NINE_ROUTER_BASE_URL` and `NINE_ROUTER_API_KEY` are present, interactive persona tasks use `<base>/chat/completions`; otherwise existing OpenRouter behavior is unchanged. A partial 9Router configuration fails clearly rather than silently routing creator prompts elsewhere.
- Require `NINE_ROUTER_PERSONA_MODELS`, a comma-separated list of up to four explicit model IDs. This avoids relying on unverified dynamic combos and preserves a reviewable fallback order. The verified initial value is `gemini/gemini-3.8-flash`.
- Send `stream: false` on chat completions. The app already needs one JSON body and does not consume provider streaming; this normalizes 9Router's default SSE behavior without a new streaming implementation.
- Omit OpenRouter-only provider price routing and attribution headers for 9Router. The existing OpenRouter path retains them.
- Keep `freeOnly` autonomous learning and `embed` on OpenRouter. 9Router's documented subscription/cheap fallback has no cost guarantee Rocket can enforce; using it in autonomous work would violate the project's zero-cost safety boundary.

## Risks / Trade-offs

- [Public tunnel changes or sleeps] → interactive requests return a safe routing failure; use a stable, authenticated production tunnel before relying on it.
- [Configured combo resolves to an unavailable provider] → use only a direct model that passes a small 9Router dashboard/API test; Rocket keeps bounded fallbacks and safe errors.
- [9Router has no compatible embedding endpoint] → OpenRouter remains required for semantic retrieval; switch only after a compatible embedding model and Qdrant reindex plan exist.
- [Compromised API key] → credentials stay Railway-only and must be rotated after exposure; Rocket never logs them.
