## Why

The configured 9Router Gemini route reaches Rocket but returns an otherwise usable JSON object with presentation text around it, causing the interactive draft shape gate to reject it as `invalid-output`. The system must tolerate harmless provider formatting without accepting incomplete or low-quality drafts.

## What Changes

- Extract one JSON object from a model response before existing narrative or reference parsing.
- Preserve strict required fields, existing output gates, reviewer checks, bounded fallback, telemetry privacy, and manual approval.
- Add tests for fenced or wrapped JSON, malformed output, and unchanged rejection behavior.

## Capabilities

### New Capabilities

- `model-output-normalization`: Safe extraction of one valid structured response from harmless model formatting.

### Modified Capabilities

- `persona-model-consistency`: Persona-model output validation accepts normalized structured responses while retaining its required narrative shape.

## Impact

Updates the narrative parsing helpers and tests only. No provider change, UI change, dependency, raw-output persistence, data migration, or automatic publishing is introduced.
