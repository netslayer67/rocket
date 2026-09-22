## Why

Free OpenRouter models can differ in formatting and default writing habits. Rocket currently passes persona data into prompts, but accepts the first available response, so a fallback model can weaken Naya's voice or return a generic angle without being measured.

## What Changes

- Introduce one versioned, compact persona voice contract derived only from the active persona's identity, thinking, claim boundaries, and current interests.
- Apply that contract consistently to narrative generation, one-time rewrites, and reference-angle suggestions.
- Route interactive persona work through an operator-configured, zero-price model list; reject the dynamic free router and boundedly try the next model only when output fails the same structured voice/quality gate.
- Persist compact accepted/rejected gate metadata per model attempt for monitoring, without prompts, raw drafts, or provider errors.
- Keep local demo behavior and manual approval intact; this is quality-aware fallback, not autonomous publishing, fine-tuning, or a claim that all models are identical.

## Capabilities

### New Capabilities

- `persona-model-consistency`: A shared active-persona contract and quality-aware free-model fallback for interactive narrative work.

### Modified Capabilities

- `persona-engine`: The active persona becomes the sole versioned voice contract for all interactive model routes.
- `narrative-authenticity-review`: Model fallback must use the existing deterministic quality gate before an output is accepted.
- `workflow-monitoring`: Monitoring exposes compact persona-model gate outcomes.

## Impact

Changes are limited to the existing AI orchestrator, persona/narrative prompt helpers, `AiRun` metadata, monitoring mapping, tests, and specifications. No new dependency, provider, queue, collection, UI surface, model training, or automatic publishing is introduced.
