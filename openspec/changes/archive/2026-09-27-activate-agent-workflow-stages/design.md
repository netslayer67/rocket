## Context

`NarrativeJob` already persists compact job events and drives both the studio SSE and `/monitoring` history. Its events presently identify only lifecycle stages, so monitoring normalizes every job as Narrative Agent. Existing AI runs, learning cycles, knowledge records, feedback, and manual analytics already supply evidence for their corresponding agents.

## Goals / Non-Goals

**Goals:**

- Attribute real narrative stages to Reference, Knowledge, Narrative, and Reviewer agents.
- Preserve those compact stage records for both the job SSE and monitoring map.
- Make the map textually distinguish recent work from waiting agents.

**Non-Goals:**

- No new worker, queue, LLM call, schedule, model routing, crawler, or automatic publishing.
- No claim that Learning or Analytics is active without a persisted learning/analytics event.
- No raw references, prompts, generated content, provider errors, or credentials in job events.

## Decisions

1. Add an optional `agent` field to existing `NarrativeJobData`, not a new collection. The existing event array is already retained and streamed, making this the smallest reliable audit trail. The runner forwards the optional field unchanged.
2. Emit four progress points from `NarrativesService.generate`: reference resolution only when a reference is supplied; knowledge retrieval; model generation; deterministic review. Each emits a status message and agent name only. This models actual work without multiplying model calls.
3. Normalize monitoring from the newest job event carrying `agent`, falling back to Narrative Agent for legacy jobs. This keeps historic data compatible.
4. The graph receives a named waiting list derived from the latest persisted events. A waiting label communicates capability and current absence of qualifying work; it is not active styling. Existing 60-second active window remains unchanged.

## Risks / Trade-offs

- [A fast job can age out before an operator opens monitoring] → history and timeline still retain the stage evidence; map remains muted rather than faking activity.
- [A draft without a reference has no Reference Agent event] → it explicitly remains waiting; a synthetic event would misrepresent work.
- [Event arrays grow with four additional records per job] → bounded job event arrays already cap storage; no raw payload is added.

## Migration Plan

Deploy API and web together. Legacy jobs omit `agent` and normalize to Narrative Agent. Rollback is safe because the field is optional and the UI defaults missing agents to waiting.

## Open Questions

None. Deeper multi-source research and platform metrics require their own approved data contracts.
