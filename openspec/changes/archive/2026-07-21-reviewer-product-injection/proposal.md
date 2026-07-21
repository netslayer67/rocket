## Why

The latest thread review shows a recurring failure: the narrative starts from a plausible scene, then takes the shortest path to a product and ends with a weak, unrelated discussion. Grammar can be clean while the result still feels like marketplace copy.

## What Changes

- Add deterministic reviewer checks for product injection, marketplace language, reasoning-flow shortcuts, and unsupported topic drift.
- Report a bounded Product Injection Score and block drafts that clearly exist to introduce the reference.
- Extend the orchestrator guidance to branch from real human concerns before a reference appears and to avoid marketplace descriptions.
- Add regression fixtures for the beach-wedding/batik failure and a coherent personal-observation control.

Non-goals: sentiment-model infrastructure, raw source storage, automatic publishing, or replacing the existing reviewer with a second service.

## Capabilities

### New Capabilities

- `narrative-authenticity-review`: Deterministic checks that protect human reasoning and contextual references.

### Modified Capabilities

- `narrative-naturalness`: Include product-injection and marketplace-language failures in the naturalness gate.

## Impact

Affected `narrative-review.ts`, generation/rewrite instructions, API reviewer tests, and the narrative naturalness spec. Reviewer notes remain stored as metadata on the existing draft; no collection or external dependency changes.
