## Why

A generated draft mixed kite-flying in a field with an unexplained floor detail. The writing is grammatically valid but has no believable scene, which makes the narrative feel fabricated and confusing.

## What Changes

- Add a narrow deterministic coherence gate for conflicting concrete scene details currently observed in generated Indonesian drafts.
- Strengthen generation and one-rewrite instructions: do not invent a concrete scene unless its objects, activities, and locations share an explicit connection.
- Keep the existing one-rewrite maximum and manual approval boundary.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `narrative-naturalness`: Block a draft when detected concrete scene details conflict without an established connection.

## Impact

Changes the narrative reviewer, generation instructions, and focused tests. No new model call, dependency, schema, API endpoint, or automatic publishing is added.
