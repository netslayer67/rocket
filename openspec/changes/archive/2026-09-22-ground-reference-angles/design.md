## Context

`NarrativesService.suggest()` fetches bounded metadata, calls the orchestrator, and falls back to `demoSuggestion()` when the model is unavailable. Shopee returned only a listing title, so the fallback copied the listing into generic promotional framing. The service already has access to the active persona.

## Goals / Non-Goals

**Goals:** prevent title-shaped/generic product angles; use active-persona reasoning only as a writing lens; return editable, low-confidence human tensions from title-only apparel metadata.

**Non-Goals:** scrape product bodies, assert material/price/performance facts, invent Naya’s purchase history, guarantee virality, or add an extra AI call.

## Decisions

- Pass a small active-persona lens into the existing prompt, not a new agent or model call.
- Add a narrow contextual rejection for exact listing-title reuse and known generic templates. This is a parser guard, not a vocabulary blacklist.
- Use a small fallback category helper for clothing terms. It yields human situations, not product properties; unknown categories return a neutral context question.

## Risks / Trade-offs

- [Fallback can still be less specific than a real description] → label metadata-only and keep fields editable.
- [Category heuristic misses products] → neutral fallback is safer than inventing facts; expand only after reviewed examples.

## Migration Plan

Deploy as a stateless API change. Existing clients retain `topic`, recommended angle, alternatives, confidence, reason, and evidence fields.

## Open Questions

None.
