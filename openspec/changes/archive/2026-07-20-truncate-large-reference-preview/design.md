## Context

`apps/api` fetches a public HTML page transiently so `NarrativesService` can suggest an editable topic. Its reader currently rejects any response whose declared or streamed size exceeds 80 KB, although the metadata needed for the preview normally appears at the document start.

## Goals / Non-Goals

**Goals:**
- Preserve the 80 KB network/read bound while accepting large valid public HTML pages.
- Keep title and description extraction transient and unchanged for normal-sized pages.

**Non-Goals:**
- No browser scraping, JavaScript rendering, metadata persistence, API-contract change, or frontend change.

## Decisions

- Return the first 80 KB rather than reject solely for size. This is the smallest safe change: existing metadata parsing already accepts HTML text, while the reader remains bounded.
- Cancel the response reader once the cap is reached. Reading the full response then slicing would defeat the resource limit.
- Keep existing validation before every request and redirect. A permissive fallback from the URL alone was rejected because it could hide unsafe or unreadable links.

## Risks / Trade-offs

- [Metadata appears after 80 KB] → Return the existing hostname fallback title; do not increase the cap or retain page content.
- [Page omits a content length] → Stream only until the same 80 KB cap, then cancel.
