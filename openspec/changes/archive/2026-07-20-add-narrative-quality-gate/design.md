## Context

`apps/api` currently rejects only a short anti-pattern list. A formal, impersonal draft with a detached URL can therefore reach the V1 manual-approval queue. The latest example also showed that a typed reference title can differ from the public URL's actual metadata.

## Goals / Non-Goals

**Goals:**
- Enforce a short conversational first-person opening, persona vocabulary, and an explicit contextual reference bridge.
- Resolve public reference metadata transiently at generation time when available.
- Block approval after one unsuccessful rewrite without adding a second reviewer model call.

**Non-Goals:**
- No claim of objective quality scores, automatic publishing, raw-page storage, schema migration, or new dependency.

## Decisions

- Reuse the deterministic reviewer rather than create another LLM agent. The new checks are cheap, explainable, and prevent the known failure before manual approval.
- Fetch the existing bounded preview during generation only when a URL exists. Its canonical title is used as context and stored with the draft when available; it never stores HTML.
- Replace the generic appended-reference fallback with one bounded rewrite. A bare URL that lacks a narrative bridge is a quality failure, not content to silently append.
- Reuse the existing blocking-note convention in `apps/web` so both new and legacy blockers disable approval.

## Risks / Trade-offs

- [Heuristics can reject an unusual but good draft] → Creator can revise or regenerate; V1 keeps final publishing manual.
- [Reference metadata is unavailable] → Preserve the creator title as fallback and still enforce visible URL context.
- [A live rewrite also fails] → Store the draft with clear blocker notes rather than spend unbounded tokens.
