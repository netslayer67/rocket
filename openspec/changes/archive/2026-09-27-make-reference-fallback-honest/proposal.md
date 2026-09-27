## Why

When every configured model fails, link-angle suggestions silently return one generic metadata fallback. The UI presents it as an ordinary suggestion, so unrelated products receive the same angle and the creator cannot distinguish a real model result from a constrained fallback.

## What Changes

- Return an explicit bounded origin for reference-angle results: model or metadata fallback.
- Replace the cross-category generic fallback with small, category-aware human-tension prompts based only on product-title signals.
- Keep unknown categories neutral and clearly metadata-only rather than inventing product facts.
- Show concise fallback state in the existing angle picker so the creator knows why suggestions are limited.

## Capabilities

### New Capabilities

- `reference-suggestion-origin`: Honest model-versus-metadata provenance for editable reference angles.

### Modified Capabilities

- `reference-suggestions`: Metadata fallback must be category-aware and visible to the creator.
- `reference-angle-discovery`: Returned angle contracts must distinguish a generated result from constrained fallback guidance.

## Impact

Touches the existing parser, suggestion response type, studio angle picker, and focused tests. No new model call, dependency, persistence, crawler, publishing behavior, or raw-page retention is introduced. Manual editing and approval remain required.
