## Context

`apps/api` stores reviewer notes with a draft, but quality rules can improve after the draft was created. `apps/web` trusts returned notes to decide whether to render manual approval.

## Goals / Non-Goals

**Goals:**
- Apply current deterministic checks to listed and approval-bound drafts without altering their text.

**Non-Goals:**
- No background migration, model call, write-back, schema change, or new UI component.

## Decisions

- Reuse `reviewNarrative` during the existing list and approval operations, merging unique transient notes with stored notes.
- Do not persist recalculated notes; this keeps the fix backward-compatible and makes future rule updates effective immediately.

## Risks / Trade-offs

- [Rules become stricter] → Older drafts can be blocked; this is intentional at the manual-approval safety boundary.
