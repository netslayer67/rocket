## Why

Interactive narrative generation aborts free OpenRouter chat requests after 30 seconds. The current free candidates can queue longer than that, and the final error only reports the last opaque `request-error`, concealing whether capacity, timeout, or a bad route caused the failure.

## What Changes

- Give interactive persona-model requests a bounded 75-second timeout while leaving embeddings and autonomous learning at their existing 30-second ceiling.
- Record a safe timeout rejection and return a compact, ordered summary of every configured candidate failure when no candidate succeeds.
- Preserve the existing no-demo behavior when an OpenRouter key exists but all live candidates fail; a failed live generation must not masquerade as a generated draft.

## Capabilities

### New Capabilities

- `interactive-model-recovery`: Bounded timeout handling and truthful safe diagnostics for interactive persona-model fallback.

### Modified Capabilities

- `model-route-diagnostics`: Failed fallback routes expose the complete safe rejection summary rather than only the final candidate.

## Impact

Changes `AiOrchestratorService`, its unit tests, and model-routing documentation. No database migration, new dependency, autonomous-learning behavior, or manual-approval boundary change is required.
