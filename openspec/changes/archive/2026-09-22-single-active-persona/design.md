## Context

`apps/api` presently stores an unbounded persona list, accepts a caller-supplied `personaId` for generation, and retrieves global knowledge. `apps/web` exposes a creation form plus a persona picker. This makes it impossible to know which narrator a lesson or quality signal belongs to.

## Goals / Non-Goals

**Goals:**

- Establish one durable active narrator with an editable, layered profile.
- Keep archived personas and historic drafts for audit, but exclude them from future generation and autonomous evidence.
- Attach every new usable DNA record to the active persona and retrieve only that scope.
- Expose an inexpensive rolling quality summary derived from existing reviewer diagnostics.

**Non-Goals:**

- No deletion or automatic rewriting of old drafts.
- No automatic claim that a fictional profile has lived experience, no demographic stereotype classifier, no trend scraping, and no model training.
- No queue, extra AI judge, dependency, multi-account persona selection, or automatic publishing.

## Decisions

1. `Persona` gains `active`, `archivedAt`, `coreIdentity`, `claimBoundaries`, and `currentInterests`. A partial unique Mongo index permits only one `active: true` profile. Existing voice fields remain, avoiding a speculative profile subsystem.
2. `PUT /personas/active` creates or updates the canonical profile. `GET /personas` returns only it. On first access, the most recent legacy persona is adopted as active and the others are archived. This gives an existing one-account deployment a deterministic migration without losing records.
3. `GenerateNarrativeDto` no longer accepts `personaId`; `NarrativesService` resolves the active persona itself. Historic narrative `personaId`s remain intact, but cannot be selected for new work.
4. New `Knowledge` records require `personaId`; all feedback, outcome, manual import, and autonomous paths obtain it from the active narrative/persona. Retrieval filters to that ID. Legacy unscoped knowledge remains stored and reindexable but is excluded rather than falsely attributed to a persona.
5. A rolling 30-day summary counts drafts and reviewer diagnostic categories for the active persona. It is deterministic, read-only, and reports signals rather than a fabricated quality score. Existing review gates keep human approval authoritative.
6. The studio reuses its existing form/card primitives: one editor replaces the persona list and the draft form displays the active narrator rather than a select control.

## Risks / Trade-offs

- [Legacy global DNA stops influencing new drafts] → Preserve it but exclude it until intentionally recreated or explicitly scoped; guessing its author would corrupt the new identity.
- [First active choice is imperfect] → Use newest legacy profile once, preserve the rest as archives, and allow direct editing afterwards.
- [Diagnostic counts are not quality proof] → Label them as review signals and retain manual approval.
- [Concurrent profile updates] → The partial unique index is the database backstop; this one-account product has no multi-user edit workflow.

## Migration Plan

1. Deploy schema/indexes and active-persona resolution.
2. First persona read selects the most recent legacy record and archives other legacy profiles.
3. Existing drafts remain readable; future generation resolves only the active record.
4. New DNA is scoped immediately; unscoped legacy DNA is retained but not retrieved.
5. Rollback consists of deploying the prior application version; fields are additive and historic records are never deleted.

## Open Questions

None. Current interests are creator-edited context, not externally scraped trend claims.
