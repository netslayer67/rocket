## Context

`NarrativesService.suggest()` currently catches any model failure and returns `demoSuggestion()`. The generic fallback is intentionally safe but not honest about its origin and only recognizes apparel. The result is an identical link angle for unrelated listings whenever OpenRouter cannot supply a valid response.

## Goals / Non-Goals

**Goals:**

- Identify generated versus metadata-fallback angle responses in the existing API contract and picker.
- Reuse the parser to derive bounded category signals from a listing title and produce distinct neutral human tensions for common categories.
- Preserve no-raw-content retention, editable angles, low confidence, and the existing model/output gate.

**Non-Goals:**

- No scraping, research discovery, new AI request, category database, persistence, or assertion of product features.
- No attempt to make metadata-only guidance as specific as a successful model result.

## Decisions

1. Add an in-memory `origin` field (`model` or `metadata-fallback`) to `NarrativeSuggestion`. It travels with the existing response and is not stored. A UI line is simpler and safer than a diagnostics panel.
2. Use a small title-token category map in the existing parser. It recognizes only observed category terms, then emits a category-level situation rather than copying a listing name or inferring specifications. Unknown categories keep a neutral fallback and are explicitly labelled.
3. Retain the current catch/fallback path. Removing it would make link suggestions unavailable whenever a free provider is briefly unavailable; falsely presenting it as AI is the defect, not the recoverable fallback.

## Risks / Trade-offs

- [A title is sparse evidence] → fallback remains low-confidence, metadata-only, and editable.
- [A new category is not recognized] → it receives the transparent neutral fallback; add categories only after observed failures.
- [A provider remains unavailable] → angles improve only to category level; routing timeline exposes the separate upstream issue.

## Migration Plan

Deploy optional response data. Older web clients ignore `origin`; the current client renders it. Rollback removes the field and leaves existing manual edit behavior intact.

## Open Questions

None. Broader research and product-page extraction remain a separate planned capability.
