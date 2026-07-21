## Context

`apps/web` currently renders the complete workflow on one long dashboard. The API contracts and data model are already adequate; the redesign is a presentation change. The creator needs a clear next action on a narrow screen, plain Indonesian copy, and enough context to understand why each workflow exists. Existing Tailwind utilities, `SectionCard`, `Field`, status badges, and the current manual-approval flow remain the only primitives.

## Goals / Non-Goals

**Goals:**

- Make the dashboard mobile-first, compact, and readable at 320px through desktop widths.
- Establish a clear sequence: orient → define voice → add patterns → draft → review.
- Replace abstract marketing copy with literal actions and outcomes.
- Preserve accessible labels, status text, estimated progress, and manual approval.
- Remove repeated visual scaffolding and keep one surface per workflow.

**Non-Goals:**

- No API, schema, authentication, crawler, model, or dependency changes.
- No automatic publish, new dashboard route, or new navigation system.
- No global design-token or component-library abstraction.

## Decisions

1. **Use a single responsive document flow.** Keep semantic sections in creator order. Use one column by default and introduce two columns only for independent setup tasks at `md`/`lg`; the generator and review queue stay full width. This is simpler and prevents mobile users from reconstructing the workflow.
2. **Use literal Indonesian copy.** Headings name the action (“Buat suara”, “Simpan pola”, “Rangkai draft”, “Review sebelum publish”). Supporting text states input, result, and next step in one short paragraph. Remove the abstract “Studio untuk mengubah insight...” sentence.
3. **Keep existing Tailwind primitives.** Adjust spacing, type scale, borders, and responsive utilities in current components and `globals.css`; add no dependency or icon system.
4. **Make state part of hierarchy.** Keep text badges and `aria-live` feedback. Pending and disabled controls state why they cannot run. Reindex remains a single API action over all knowledge records; the UI explains it without exposing model internals.
5. **Use compact summaries only for decisions.** Keep counts when they tell the creator what is ready; avoid decorative metric cards and repeated eyebrow labels.

## Risks / Trade-offs

- [Long page remains] → Use concise sections and anchored headings; a separate router is out of scope.
- [Dense mobile layout] → Keep 16px viewport padding, 14px minimum body text, and generous separation between workflows.
- [Copy changes alter expectations] → Keep API labels and manual approval semantics unchanged; test all action states.
- [No visual regression tool] → Perform manual narrow/wide, keyboard, reduced-motion, and rendered-route checks required by `context/AI-SLOP.md`.
