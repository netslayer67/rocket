## Context

`apps/web` already has a mobile-first Studio and a truthful monitoring route, but overview counts, technical libraries, a neural map, and maintenance controls receive similar visual weight to the creator's next action. The API contracts and existing Tailwind primitives are sufficient.

## Goals / Non-Goals

**Goals:** make the creator path (setup, draft, review) scannable, move optional library/analytics/connectivity maintenance behind native disclosures, make monitoring lead with worker state and event history, and retain readable layouts at phone, tablet, and desktop widths.

**Non-Goals:** changing data, API responses, worker behavior, review rules, publishing boundaries, visual branding, or adding a component/animation dependency.

## Decisions

- Use semantic `details`/`summary` for optional library, analytics, connection, technical-map, and maintenance content. This is the native accessible disclosure instead of a new accordion component.
- Preserve the existing setup pair as the only wide-screen grid. Every primary draft and review section remains one readable column, while controls use existing wrapping/full-width mobile button utilities.
- Keep monitoring's worker panel first, put timeline before the graph, and default the graph closed as supporting technical evidence. The linear timeline is the equivalent accessible reading path.
- Replace repeated summary-card surfaces with compact definition lists and headings. This removes equal-weight decoration without hiding real status.

## Risks / Trade-offs

- [Optional details are initially hidden] → summaries state the contained action and result; primary drafting/review content is never hidden.
- [Operators need the graph] → it remains one keyboard-accessible disclosure below the event timeline.
- [Large existing forms remain lengthy] → this change only reorganizes hierarchy; break forms further only after observed completion friction.

## Migration Plan

Deploy as a frontend-only additive presentation change. Browser-native disclosures require no data migration. Roll back by restoring the prior component composition; no stored state changes.
