## Context

`apps/api` sends all `json: true` requests through `AiOrchestratorService` with OpenRouter's `response_format: { type: 'json_object' }`. The interactive narrative, rewrite, and angle flows use named free persona models and already supply a versioned voice contract plus a deterministic parser/output gate. Some of those models reject the provider JSON-format option, returning HTTP 400 before that gate can run. `NarrativeJobRunner` emits this as `error` at 100%, while `apps/web` also forces any failed request to 100%.

No schema, endpoint, provider, or manual-approval contract changes.

## Goals / Non-Goals

**Goals:**

- Allow configured named free persona models to produce prompt-constrained JSON and be validated by the existing shared gate.
- Retain strict provider JSON formatting for every other structured request.
- Make an error visibly incomplete in both the job event and Studio state.

**Non-Goals:**

- Adding a model capability registry, changing the four-model bound, exposing provider failures, or relaxing a narrative quality gate.
- Retrying a job after all configured candidates fail, changing Mongo data, or automating publication.

## Decisions

1. Omit `response_format` only when `request.personaModels` is true. Persona prompts already demand JSON; `narrativeOutputGate` and `suggestionOutputGate` reject malformed or low-quality output and advance only to the next bounded candidate. This is the narrowest compatibility change. A provider capability registry was rejected: it would be speculative and maintenance-heavy for one request category.
2. Keep `response_format` for ordinary `json: true` requests. This preserves existing structured-result behavior for internal learning and other non-persona work.
3. Emit narrative job errors at 95% and keep the browser's existing server value when `onGenerate` returns false. The job has reached a terminal state, but it has not completed its outcome. Replacing the status with 0% would falsely imply no work occurred; retaining 100% falsely implies success.

## Risks / Trade-offs

- [A persona model returns prose instead of JSON] -> The existing parser/output gate rejects it and tries only the remaining configured candidates.
- [A model supports strict JSON and would have benefited from it] -> The shared prompt and deterministic gate remain effective; compatibility is more valuable than a provider-only constraint for this mixed free set.
- [A user reads 95% as nearly successful] -> The textual state explicitly says `Proses gagal`, and the server message remains the authoritative failure description.

## Migration Plan

Deploy the API and web changes together. Verify a new generation produces a persisted draft; if all providers are unavailable, verify the Studio shows `Proses gagal` below 100%. Roll back the commit to restore the prior request shape; no data migration or cleanup is required.

## Open Questions

None.
