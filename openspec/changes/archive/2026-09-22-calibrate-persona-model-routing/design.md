## Context

Interactive generation currently uses the first configured OpenRouter response. The existing persona is complete enough to describe one character, and the reviewer already produces deterministic, explainable quality diagnostics. Reusing those two assets is smaller and safer than training, judging with another model, or building a routing service.

## Goals / Non-Goals

**Goals:**

- Give every interactive model the same compact, active-persona voice contract.
- Use only named zero-price models for persona work and try the next configured model only after availability, JSON-shape, or quality-gate failure.
- Retain compact acceptance metadata so an operator can see which model passed or failed a gate.

**Non-Goals:**

- Fine-tuning, autonomous model evaluation jobs, universal style equality, new UI controls, new providers, queues, raw-output retention, automatic publishing, or changing the internal-learning allowlist.

## Decisions

1. A pure `personaVoiceContract` helper will serialize the active persona's name, core identity, tone, thinking/observation guidance, claim boundaries, and current interests into a versioned instruction. Generation, rewrite, and angle suggestion will all reuse it. This is preferable to a second stored contract because the active persona remains the source of truth.
2. `AiRequest` will accept a synchronous output gate. The orchestrator will call it before caching or accepting a live response; a rejection logs only a bounded reason and tries the next named persona model. This reuses existing fallback control flow rather than adding a router or judge-model call.
3. Persona model candidates come from `OPENROUTER_PERSONA_MODELS`, falling back to `OPENROUTER_MODELS`, are restricted to named `:free` models, reject `openrouter/free`, deduplicate, and cap at four. Four is sufficient diversity without turning one draft into an unbounded token sink. `OPENROUTER_LEARNING_MODELS` remains unchanged for private autonomous-learning evidence.
4. Narrative gates parse the required JSON then reuse the deterministic review/quality result. Angle gates reuse the existing parser so generic or listing-title output cannot become a successful model response. Rejected attempts never store prompt or content.
5. `AiRun` adds `accepted` and an optional bounded `rejection` code. Monitoring maps those fields into status/details without exposing output.

## Risks / Trade-offs

- [All configured free models fail a gate] → existing narrative job error path and manual retry remain available; no paid fallback or automatic demo knowledge is used.
- [A deterministic gate misses a weak voice] → it remains an approval-time quality snapshot, not a claim of perfect voice fidelity; operator review is unchanged.
- [A four-model list adds latency after bad output] → only fallback attempts are made, each retains the existing timeout, and the list is capped.
- [A stale cached answer bypasses a new gate] → persona-routed requests are not cached, matching private free-learning behavior.

## Migration Plan

1. Deploy code with the default free configured model list as the compatibility fallback.
2. In Railway, set `OPENROUTER_PERSONA_MODELS` to up to four currently available named `:free` models, ordered by observed quality; do not use `openrouter/free`.
3. Watch `/monitoring` for accepted and rejected persona-model attempts. Roll back by removing the variable; the current `OPENROUTER_MODELS` fallback still applies.

## Open Questions

None. Per-model offline benchmarks and automatic rank changes remain a later operational-scaling slice, after enough reviewed outputs exist.
