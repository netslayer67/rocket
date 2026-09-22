## Why

The production Shopee suggestion fell back to a static template that copied the marketplace title into a generic “sudut lain” topic. That directly violates Rocket’s purpose: it creates a product-led, generic prompt before Naya can provide any human observation.

## What Changes

- Reject product-title-shaped angles from live model output and demo fallback output.
- Use the active persona’s thinking and observation guidance for live suggestions without fabricating her experience.
- Replace metadata-only commerce fallback with bounded, category-aware human tensions and clear low-confidence provenance.
- Preserve editable recommended and alternative angle contract, manual approval, raw-source restrictions, and existing API shape.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `reference-suggestions`: Ensure metadata-only product suggestions never turn a marketplace listing title into the narrative topic.
- `reference-angle-discovery`: Require concrete, non-promotional human tension in returned angles and reject known generic angle templates.

## Impact

Changes are limited to the narrative suggestion parser/prompt and existing tests. No new dependency, worker, model route, raw-page storage, publishing behavior, or UI surface is added.
