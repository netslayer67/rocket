# Design System

## Product feeling

The dashboard should feel like a focused creator studio: calm, editorial, and deliberate. It must help a user move from persona to approved narrative without looking like an affiliate-sales tool.

The anti-slop policy in [AI-SLOP.md](AI-SLOP.md) is mandatory for new UI work. The Impeccable catalog is used as a rejection checklist, not as a visual style to imitate.

## Visual direction

- Dark slate canvas with one cyan accent for actions and system state.
- Cards use thin slate borders, moderate rounding, and low-contrast surfaces.
- Typography is compact and readable: a strong page title, muted explanatory text, and clear form labels.
- Use Tailwind utility classes only; do not add a component library for V2.
- Avoid generic AI visual defaults: purple gradients, cyan glows, gradient text, ubiquitous glass, nested cards, identical feature grids, oversized icon tiles, and repeated eyebrow chips.
- Keep type, spacing, contrast, motion, and copy decisions explainable by the creator workflow. Decorative novelty is not a design rationale.

## Layout

```text
Header: status + refresh
Overview: personas | patterns | drafts
Connection: Threads OAuth status + connect/disconnect action
Workspace: create persona | import knowledge
Generator: topic + persona + reference
Knowledge Library: extracted pattern + semantic index status + reindex
Review queue: draft cards + manual approval
Feedback: dimension scores + explicit learning approval
Signals: manual metrics + learning run
```

On small screens each section stacks vertically. On large screens the workspace is two columns and generator/review use the full width.

## Interaction rules

- Every input has a visible label, not placeholder-only instructions.
- Disabled actions state why they cannot run.
- Success and error feedback use an `aria-live` status message.
- Review notes are visible before manual approval, and any blocking note disables approval.
- A reference-link suggestion is explicit, fills editable fields, and explains that it is a starting point rather than a claim about a person or product.
- Pending link-suggestion actions show an animated percentage labelled as an estimate. Narrative generation shows the server-reported SSE stage and percentage; the UI never presents a client estimate as backend telemetry.
- Semantic status is text-based (`Semantic ready` or `Index pending`) and does not rely only on color.
- Status never relies on color alone; it is rendered as text.
- Threads connection describes its status and token expiry in text and keeps unavailable actions hidden.
- Publish is a separate labeled action after approval; feedback and metrics use native disclosure/forms to keep the review card readable.
- Public crawling is intentionally absent from the dashboard in V1; its manual command documentation is the approval boundary.

## Reusable primitives

Use `SectionCard`, `Field`, `StatusBadge`, and the shared `Button` style from global CSS. Components may compose those primitives but should not become a local design system.

Before accepting a material visual change, record the anti-slop, contrast, keyboard, narrow-viewport, overflow, and reduced-motion review described in [AI-SLOP.md](AI-SLOP.md).
