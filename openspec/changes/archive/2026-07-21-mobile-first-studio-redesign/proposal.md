## Why

The current dashboard exposes every workflow with similar visual weight, long copy, and a large desktop-first rhythm. On a phone, the creator must scan too much before understanding what to do next, and phrases such as “mengubah insight menjadi diskusi” do not explain the concrete result. This redesign makes the path from setup to approved draft obvious, compact, and readable without changing the manual-approval boundary.

## What Changes

- Reorder the dashboard around the creator's sequence: orient, prepare voice, learn patterns, draft, then review.
- Replace abstract hero and section copy with literal Indonesian instructions and outcomes.
- Rework layout primitives and existing components for a mobile-first single-column flow that expands into focused desktop groups.
- Clarify empty, pending, success, error, disabled, and loading states with text and accessible status announcements.
- Reduce repeated visual scaffolding, decorative labels, and unnecessary nested surfaces while preserving the existing slate/cyan visual direction.
- Keep all current API contracts, semantic indexing, persona data, narrative review, and manual approval behavior unchanged.

## Capabilities

### New Capabilities

- `mobile-first-studio-ui`: A responsive creator workflow with explicit hierarchy, compact mobile layout, and plain-language guidance.

### Modified Capabilities

- `narrative-studio-ui`: Update dashboard hierarchy, copy, responsive behavior, and state communication requirements.
- `ai-slop-guardrails`: Record the redesign review and enforce the compact, literal, anti-slop UI direction.

## Impact

Affected files are the Next.js page, studio components, shared Tailwind/CSS primitives, and UI specs/context. No API, database, model, crawler, or dependency changes are required. Manual approval remains mandatory; this change only improves how creators understand and operate the existing flow.
