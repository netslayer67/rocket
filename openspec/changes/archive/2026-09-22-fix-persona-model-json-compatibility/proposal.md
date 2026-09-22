## Why

The active Railway configuration contains named free persona models, but some reject OpenRouter's strict `response_format` option. Every candidate therefore fails with HTTP 400, so a generation job reaches an error event instead of persisting a draft; the browser then misleadingly redraws that failure as 100%.

## What Changes

- Keep persona prompts and their shared output gate as the JSON contract, while omitting the unsupported provider-level JSON-format option for named free persona models.
- Preserve strict JSON-format requests for non-persona structured tasks.
- Report a failed narrative job as incomplete progress and preserve that server-reported failure state in the Studio.
- Add focused regression coverage for both request shapes and failure progress.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `persona-model-consistency`: named free persona fallbacks must remain compatible with providers that do not implement strict JSON formatting.
- `narrative-sse-generation`: failed jobs must report an unambiguous non-success terminal state.
- `narrative-studio-ui`: the Studio must preserve a server-reported failure percentage rather than rendering it as successful completion.

## Impact

Touches the shared AI orchestrator, narrative-job lifecycle, Studio progress UI, targeted tests, and the UI review record. It adds no provider, model, storage field, telemetry body, automated publishing, or change to the manual-approval boundary.
