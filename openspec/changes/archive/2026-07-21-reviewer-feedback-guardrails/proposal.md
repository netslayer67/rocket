## Why

The latest basketball-trade review shows a draft can be grammatically clean yet fail the product goal: it reads like news, contains no personal tension, asks a broad closing question, and attaches an unrelated product link. Existing checks catch some generic phrases but do not encode this reviewer lesson as reusable knowledge or enforce a concrete information gap.

## What Changes

- Add reviewer checks for missing curiosity/information gap and forced broad closing questions.
- Pass the topic into review context so link relevance is evaluated against the narrative brief.
- Mark retrieved low-naturalness or anti-pattern lessons as constraints, not writing styles.
- Add one compact negative-learning knowledge record for the reviewed basketball-trade failure, without storing raw thread text or the full review transcript.
- Preserve the manual review and approval gate.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `narrative-naturalness`: reviewer and generator must reject article-style, low-curiosity, persona-free drafts and treat anti-pattern knowledge as a warning.
- `knowledge-engine`: negative reviewer lessons are stored as reusable metadata patterns.

## Impact

- Affects `apps/api/src/narratives/narrative-review.ts`, `apps/api/src/narratives/narratives.service.ts`, and related tests.
- Adds one metadata-only document to MongoDB and its derived Qdrant point after reindexing.
- No new dependency, route, UI surface, or publishing behavior.
