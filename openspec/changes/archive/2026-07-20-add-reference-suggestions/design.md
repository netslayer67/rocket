## Context

The narrative form is intentionally simple and stores only the selected title and URL with a draft. Link metadata is currently unused, leaving creators to research and enter both fields manually.

## Goals / Non-Goals

**Goals:**

- Read a public page's title and description transiently from a creator-provided URL.
- Return an editable factual title plus one broader, curiosity-led topic through the existing AI Orchestrator.
- Keep user-supplied URLs at a safe API boundary and keep all fetched page content out of storage, logs, Qdrant, and the model prompt.

**Non-Goals:**

- No crawling, full-page analysis, affiliate link manipulation, automatic narrative generation, automatic publishing, or claim verification about third parties.

## Decisions

- Use native `fetch`, DNS lookup, manual bounded redirects, an HTML size limit, and title/description extraction. This meets the single-link need without a scraping dependency.
- Send only host, extracted title, and description to the AI. The returned title comes from metadata; the model supplies only the editable topic angle.
- Use a button rather than trigger on every paste. It makes the external request intentional and preserves existing uncontrolled form inputs.

## Risks / Trade-offs

- [A page hides metadata behind JavaScript or blocks requests] → Return a clear message; creators can type the title themselves.
- [A topic could overstate a connection] → Prompt forbids unsupported claims and the creator edits the suggestion before draft generation.
- [A URL targets local infrastructure] → Permit only public HTTP(S) hosts, validate each redirect, reject private addresses, non-HTML responses, and oversized bodies.
