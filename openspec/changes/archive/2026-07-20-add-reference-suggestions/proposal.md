## Why

Creators currently need to invent a topic and reference title before a narrative can begin. A reference URL should provide an editable starting point, while the narrative angle remains free to explore a broader, truthful phenomenon rather than repeat the product category.

## What Changes

- Add a URL-driven suggestion endpoint that reads transient public page metadata and returns a factual reference title plus one editable topic suggestion.
- Generate the topic through the existing AI Orchestrator, with instructions to find a contextual bridge without inventing endorsement, personal, product, or performance claims.
- Add an “Isi saran dari link” control that fills the reference title and topic fields without generating or publishing a narrative.
- Reject unsafe, unsupported, oversized, non-HTML, or excessive-redirect reference fetches and retain no fetched page content.

## Capabilities

### New Capabilities

- `reference-suggestions`: Generate editable reference title and phenomenon suggestions from transient public link metadata.

### Modified Capabilities

- `narrative-studio-ui`: Provide an accessible URL-to-form suggestion action in the narrative workspace.

## Impact

- Affects the NestJS narratives API, AI task telemetry, URL metadata helper, Next.js narrative form, and project documentation.
- Adds no dependency, collection, automatic publish action, or retained source content.
