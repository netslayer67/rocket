## Why

Outcome analytics currently stop at a reviewable candidate, so a useful signal cannot become reusable DNA without a controlled decision. Reference discovery also sees mostly title and description, which limits safe context selection for product, article, book, and video links. This change closes both V2 gaps while preserving manual approval, transient source handling, and diagnosis-first learning.

## What Changes

- Add an explicit, authenticated-by-request approval boundary for promoting one analytics candidate into a Knowledge DNA lesson.
- Require the operator to choose positive or negative lesson type; persist an idempotent link from the narrative to the promoted lesson and show the status in the dashboard.
- Keep manual samples descriptive rather than causal, with evidence provenance and a bounded diagnosis.
- Enrich transient reference previews with safe metadata such as type, site, author, section, publish time, price, currency, and canonical URL when present.
- Pass enriched metadata to suggestion and generation prompts without persisting page bodies or adding a crawler dependency.

Non-goals: automatic promotion, causal performance claims, model routing/benchmarking, full-page scraping, or replacing manual feedback review. Existing draft review and manual publish boundaries remain unchanged.

## Capabilities

### New Capabilities
- `outcome-dna-promotion`: Explicitly promote a reviewed analytics candidate into diagnosis-first Knowledge DNA.
- `reference-metadata-enrichment`: Extract and use bounded, transient reference metadata beyond title and description.

### Modified Capabilities
- `narrative-analytics`: Expose promotion status and an approval endpoint for outcome candidates.
- `reference-suggestions`: Include richer metadata in safe, editable suggestion context.

## Impact

Affected NestJS analytics and narrative services/controllers, KnowledgeModule wiring, the Narrative schema, and the compact analytics dashboard. MongoDB stores only the lesson reference and promotion timestamp on the narrative; Qdrant indexing continues through KnowledgeService. No new dependency or service is introduced. Tests, OpenSpec specs, and V2 context documentation will cover positive, negative, idempotent, unsafe, and metadata-absent scenarios.
