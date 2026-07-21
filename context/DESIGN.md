# Design System

## Product feeling

The dashboard should feel like a focused creator studio: calm, editorial, and deliberate. It must help a user move from persona to approved narrative without looking like an affiliate-sales tool.

## Visual direction

- Dark slate canvas with one cyan accent for actions and system state.
- Cards use thin slate borders, moderate rounding, and low-contrast surfaces.
- Typography is compact and readable: a strong page title, muted explanatory text, and clear form labels.
- Use Tailwind utility classes only; do not add a component library for V2.

## Layout

```text
Header: status + refresh
Overview: personas | patterns | drafts
Connection: Threads OAuth status + connect/disconnect action
Workspace: create persona | import knowledge
Generator: topic + persona + reference
Knowledge Library: extracted pattern + semantic index status + reindex
Review queue: draft cards + manual approval
```

On small screens each section stacks vertically. On large screens the workspace is two columns and generator/review use the full width.

## Interaction rules

- Every input has a visible label, not placeholder-only instructions.
- Disabled actions state why they cannot run.
- Success and error feedback use an `aria-live` status message.
- Review notes are visible before manual approval, and any blocking note disables approval.
- A reference-link suggestion is explicit, fills editable fields, and explains that it is a starting point rather than a claim about a person or product.
- Pending link-suggestion and narrative actions show an animated percentage labelled as an estimate; the UI never presents it as backend telemetry.
- Semantic status is text-based (`Semantic ready` or `Index pending`) and does not rely only on color.
- Status never relies on color alone; it is rendered as text.
- Threads connection describes its status and token expiry in text and keeps unavailable actions hidden.
- Public crawling is intentionally absent from the dashboard in V1; its manual command documentation is the approval boundary.

## Reusable primitives

Use `SectionCard`, `Field`, `StatusBadge`, and the shared `Button` style from global CSS. Components may compose those primitives but should not become a local design system.
