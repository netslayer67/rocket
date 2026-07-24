## Context

Analytics already groups bounded manual captures into read-only candidates. KnowledgeService already owns lesson creation and Qdrant indexing, while the web dashboard uses the existing Tailwind primitives. Reference preview currently keeps page content transient and extracts title/description; generation and suggestion prompts already accept a transient reference context.

## Goals / Non-Goals

**Goals:**

- Make candidate promotion explicit, typed, auditable, and idempotent.
- Reuse KnowledgeService so MongoDB metadata and Qdrant indexing follow the existing path.
- Add bounded reference metadata that improves safe context selection without retaining page bodies.

**Non-Goals:**

- Automatic promotion, causal attribution, background crawling, or new queue/dependency/service layers.
- Storing fetched HTML, full product data, or credentials.

## Decisions

1. **Explicit approval contract.** `POST /analytics/insights/:narrativeId/promote` requires `approved: true` and `lessonType: positive|negative`. A native select plus confirmation in the dashboard is sufficient for V2; no new workflow service is justified.
2. **Idempotent narrative link.** Store `outcomeKnowledgeId` and `outcomePromotedAt` on the narrative. Repeating a promotion returns the existing lesson instead of creating duplicates.
3. **Diagnosis-first lesson payload.** The lesson records sample count, manual provenance, non-causal diagnosis, root cause, recommended fix, and failure dimensions. A single sample is a signal, not a universal rule.
4. **Bounded metadata only.** Extract type, site name, author, section, published time, price, currency, and canonical URL when present. Each value is capped and omitted when absent; the page body remains transient.
5. **Prompt context, not persistence.** Enriched metadata is passed to the existing orchestrator prompt for angle selection and generation, with the existing lexical/semantic retrieval and token budgets unchanged.

## Risks / Trade-offs

- [Manual metrics can be misleading] → Label lessons as observational and retain sample count/provenance; never claim causation.
- [Metadata may be stale or malformed] → Treat every field as optional, bounded, and editable; keep existing fallback behavior.
- [Promotion duplicates under concurrent clicks] → Check the narrative link before creation and make the UI disable while busy; future database uniqueness can harden this if real contention appears.
- [UI becomes too dense] → Reuse the existing compact candidate row and show only one approval control per candidate.

## Migration Plan

Deploy schema fields as optional. Existing narratives remain candidates. Existing preview responses remain compatible because new metadata fields are omitted when unavailable. Roll back by disabling the promotion route; stored lesson references and optional fields are harmless to older readers.
