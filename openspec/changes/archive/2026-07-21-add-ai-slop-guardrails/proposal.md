## Why

Rocket's current dark Tailwind dashboard is readable, but its visual vocabulary can drift toward the same AI-generated SaaS patterns it is meant to avoid in narrative quality. The Impeccable Slop catalog identifies recurring tells across visual details, typography, color, layout, motion, copy, imagery, and accessibility. We need a project-level contract before more screens and components are added.

## What Changes

- Add a strict AI-slop design policy covering visual hierarchy, typography, color, spacing, motion, copy, imagery, accessibility, and responsive behavior.
- Record the policy in `context/AI-SLOP.md`, link it from the design and engineering rules, and require a deliberate exception for any flagged pattern.
- Add OpenSpec requirements for a measurable UI quality gate and manual design review.
- Define Ponytail constraints: reuse existing Tailwind primitives, avoid new UI dependencies, and prefer deletion or native CSS over decorative abstractions.

Non-goals: adding a detector dependency, redesigning the dashboard in this change, changing API or database contracts, or banning a pattern when its product context explicitly requires it.

## Capabilities

### New Capabilities

- `ai-slop-guardrails`: Strict, testable design and implementation rules that prevent generic AI-generated UI patterns.

### Modified Capabilities

- `narrative-studio-ui`: Document that future UI work must satisfy the AI-slop guardrails and preserve the manual-approval workflow.

## Impact

The change affects project context, UI review, OpenSpec planning, and future Tailwind components in `apps/web`. It adds no runtime dependency, schema, API endpoint, or model call. Existing V1 screens remain functional; future changes must include a guardrail review and record any intentional exception.
