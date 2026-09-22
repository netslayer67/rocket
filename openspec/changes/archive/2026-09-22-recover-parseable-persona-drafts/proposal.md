## Why

Production retrieval is correctly falling back after Qdrant search fails, but narrative generation still stops because every free-model candidate is required to pass the final deterministic review before a draft exists. That duplicates the later rewrite-and-manual-review workflow and makes a recoverable quality issue look like an unavailable service.

## What Changes

- Route across free persona models until one returns the required parseable narrative shape.
- Keep the existing deterministic review, one bounded rewrite attempt, quality snapshot, and manual approval block after parsing.
- Distinguish malformed output from a parseable draft that needs reviewer work in tests and monitoring behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `narrative-authenticity-review`: final quality diagnostics move from model-route acceptance to the existing review and approval boundary.
- `persona-model-consistency`: a valid narrative shape is the bounded fallback acceptance condition; malformed output remains rejected.

## Impact

Touches narrative output-gate helpers, generation and rewrite calls, and focused tests. It does not expose raw model output, weaken the reviewer, publish automatically, add a model/provider, alter Qdrant, or bypass manual approval.
