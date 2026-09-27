## Why

OpenRouter's free chat capacity is rate-limited in production, while the creator's reachable 9Router tunnel has a verified direct chat route (`gemini/gemini-3.8-flash`). Rocket needs to use that OpenAI-compatible chat endpoint without breaking its existing Qdrant embedding collection.

## What Changes

- Route interactive persona chat completions through a configured 9Router-compatible `/v1` endpoint when its endpoint and key are supplied.
- Send `stream: false` explicitly because the verified 9Router route defaults to SSE while Rocket's orchestrator consumes JSON responses.
- Use an operator-configured, bounded 9Router model list for persona chat; preserve one active-persona contract, output gates, telemetry, and no automatic publishing.
- Keep OpenRouter configured solely for the existing compatible embedding route until a 9Router embedding model is explicitly configured and reindexed.
- Keep autonomous learning on the existing free-only OpenRouter route, or disabled. 9Router's subscription/cheap fallback cannot satisfy Rocket's zero-cost autonomous-learning guarantee without an auditable provider-cost contract.
- Document production tunnel, model, credential, and failure requirements. **BREAKING**: `NINE_ROUTER_*` values take precedence for chat when present.

## Capabilities

### New Capabilities

- `nine-router-chat-routing`: Safe, bounded OpenAI-compatible 9Router routing for Rocket chat tasks.

### Modified Capabilities

- `persona-model-consistency`: Persona fallback supports bounded explicit 9Router model IDs while retaining one voice contract.

## Impact

Changes the existing AI orchestrator, model policy/tests, API environment example, README, and architecture documentation. No frontend, data migration, new dependency, Qdrant collection change, crawler behavior, or manual-approval boundary change is included.
