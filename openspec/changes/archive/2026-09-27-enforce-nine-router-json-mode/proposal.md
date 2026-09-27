## Why

Production telemetry shows 9Router reaches `gemini-3.8-flash` but the model returns non-JSON content for interactive structured requests. Rocket correctly rejects it as `invalid-output`; normalizing Markdown wrappers cannot turn prose into a valid draft.

## What Changes

- Require OpenAI-compatible JSON-object mode for interactive 9Router requests that already request structured output.
- Retain the existing prompt, output gate, bounded model list, telemetry privacy, and manual approval boundary.
- Add a route-level test proving JSON mode applies to 9Router only.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `nine-router-chat-routing`: Interactive structured requests must explicitly request JSON-object output.

## Impact

Updates the AI orchestrator and its tests. No UI, data schema, provider fallback, embedding, autonomous-learning, or publishing behavior changes.
