## Context

Impeccable's Slop catalog groups recurring AI-generated UI tells into visual details, typography, color and contrast, layout and space, motion, copy, imagery, and general quality. Its page pairs synthetic specimens with an in-place rule overlay, then explains whether a rule is deterministic, browser-based, or LLM-only. The useful lesson for Rocket is the classification and review discipline, not the specimen styling itself.

Rocket currently uses one Tailwind design system in `apps/web`. The NestJS API, MongoDB schemas, Qdrant collection, and AI orchestration contracts are unaffected. The source reference is https://impeccable.style/slop/.

## Goals / Non-Goals

**Goals:**

- Make anti-slop review a required UI acceptance step.
- Preserve a calm, editorial creator-studio identity instead of a generic AI SaaS look.
- Give designers and agents concrete thresholds for type, contrast, spacing, motion, copy, imagery, and responsive behavior.
- Keep exceptions explainable, local, and cheap to maintain.

**Non-Goals:**

- No detector package, browser extension, LLM review call, or CI visual-regression service in this change.
- No redesign of existing screens.
- No MongoDB, Qdrant, NestJS, or frontend API contract changes.

## Decisions

### Policy as a context contract

Create `context/AI-SLOP.md` as the canonical checklist. `context/DESIGN.md` keeps the product-specific visual direction, while `context/RULES.md` makes the review mandatory. OpenSpec receives normative requirements and scenarios; it does not duplicate every catalog example.

### Existing Tailwind primitives first

Continue using the existing global classes and local components. A new primitive is justified only after the same treatment appears in at least two workflows. CSS transitions, semantic HTML, and browser accessibility features are preferred over new packages.

### Severity and exceptions

Critical failures block merge: unreadable contrast, clipped content, missing labels, broken imagery, layout overflow, or a repeated generic pattern in a primary workflow. Contextual exceptions are allowed only when the review records the reason, user value, and a simpler alternative that was rejected.

### Review evidence

Every UI change records a short checklist result in its pull request or OpenSpec task. A screenshot or rendered route is required for visual changes; keyboard and narrow viewport checks are required for interactive changes. No runtime telemetry is introduced.

## Risks / Trade-offs

- [Risk] A rigid blacklist can erase legitimate brand expression. → [Mitigation] Allow documented, user-serving exceptions and judge repeated patterns in context, not isolated tokens.
- [Risk] Manual review can be inconsistent. → [Mitigation] Use explicit thresholds and a small pass/fail checklist before considering automation.
- [Risk] A future detector may flag intentional design. → [Mitigation] Keep detector output advisory until false-positive rates are measured on Rocket screens.

## Migration Plan

1. Add the context policy and OpenSpec requirements.
2. Link the policy from the existing design and engineering rules.
3. Apply the checklist to every new or materially changed `apps/web` route.
4. If repeated manual findings justify automation, evaluate a dev-only detector in a separate OpenSpec change.

Rollback is documentation-only: revert the policy links and archived change; no data migration is required.

## Open Questions

- Which UI review surface will store evidence after pull requests are introduced?
- Should a future detector run against source, rendered pages, or both? Decide only after manual findings establish a useful baseline.
