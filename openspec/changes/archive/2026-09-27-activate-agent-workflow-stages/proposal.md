## Why

The monitoring map currently shows a single generic Narrative Agent for a draft job, even when reference resolution, knowledge retrieval, and review have already happened. This makes the available agents look inactive and hides the real workflow the operator needs to understand.

## What Changes

- Persist compact, stage-owned events during a narrative job for Reference, Knowledge, Narrative, and Reviewer work.
- Expose the stage owner in job SSE events and monitoring history without storing prompts, source contents, generated bodies, or credentials.
- Make the monitoring map derive each agent's recent state from these events, while preserving honest waiting states for Learning and Analytics until they have qualifying evidence or captured outcomes.
- Keep a single bounded job pipeline; no background AI polling, synthetic activity, extra queue, or automatic publishing is introduced.

## Capabilities

### New Capabilities

- `agent-stage-observability`: Compact, persisted ownership events for actual narrative workflow stages.

### Modified Capabilities

- `workflow-monitoring`: Monitoring history and SSE expose the actual agent responsible for a job stage.
- `neural-workflow-map`: Agent nodes distinguish recent work from a genuinely waiting state without fabricating activity.

## Impact

Touches the existing narrative job event payload, narrative generation progress callbacks, monitoring event normalization, and the monitoring graph. The manual approval and publish boundary remains unchanged; no new dependency or model call is added.
