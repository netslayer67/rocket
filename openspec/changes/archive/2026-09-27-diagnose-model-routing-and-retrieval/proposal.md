## Why

A failed persona-model request currently ends as an undifferentiated 404, so an operator cannot tell whether a model is unavailable, filtered by provider policy, or misconfigured. The monitoring map also only lights Qdrant on indexing, misleading operators during a successful semantic read.

## What Changes

- Persist a bounded, safe outcome for each failed model candidate so the next fallback and the final job error are diagnosable without retaining provider bodies or creator content.
- Expose semantic retrieval metadata in monitoring and activate Qdrant only when an actual semantic query contributed to a draft context.
- Keep Mongo lexical/recent fallback available when Qdrant retrieval fails; generation must not write or reindex Qdrant on every draft.

## Capabilities

### New Capabilities

- `model-route-diagnostics`: Compact per-candidate routing outcomes for failed and successful configured models.

### Modified Capabilities

- `workflow-monitoring`: Monitoring exposes safe model failure and semantic retrieval status.
- `neural-workflow-map`: Qdrant represents actual semantic read activity rather than indexing-only activity.

## Impact

Touches the existing AI run telemetry, safe error mapping, monitoring event normalizer, graph state, and tests. The existing free-only model policy, manual approval, and no-raw-content boundary remain unchanged. No new model call, dependency, worker, queue, or automatic publishing is introduced.
