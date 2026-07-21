## Why

The generate API can finish successfully while the review queue still shows the previous list. The current UI waits for a broad refresh, so a slow or stale parallel refresh can hide the newly saved draft and leave the creator unsure whether the action worked.

## What Changes

- Insert the API response into the narrative queue immediately after a successful generation.
- Guard refresh results so an older request cannot overwrite newer studio state.
- Keep refresh failures visible without discarding a draft already returned by the generate API.
- Preserve manual review and approval; no publishing behavior changes.

## Capabilities

### New Capabilities

- `narrative-queue-reliability`: Keep newly generated drafts visible despite refresh timing or partial dashboard failures.

### Modified Capabilities

- `narrative-studio-ui`: Clarify that generation success is represented by the returned draft in the review queue.

## Impact

- Affects `apps/web/src/hooks/use-studio.ts` and its narrative form/queue state flow.
- No API, database, dependency, or manual-approval contract changes.
- A draft remains unpublished and still displays reviewer warnings.
