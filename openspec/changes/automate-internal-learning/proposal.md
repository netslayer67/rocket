## Why

The current timer only converts approved feedback. An open monitoring stream is not an autonomous learning engine. The creator has explicitly authorized continuous consolidation of approved internal feedback, DNA, and approved narratives using only free OpenRouter models.

## What Changes

- Run bounded internal learning on the persistent Railway API independently of browser traffic.
- Select approved internal evidence, synthesize one diagnosis-first lesson, validate it in a second free-model call, and persist only accepted metadata with provenance.
- Deduplicate unchanged evidence, exclude autonomous outputs from future inputs, bound daily attempts, and expose waiting, failure, and quota states.
- Enforce free-only routing for every autonomous chat and embedding call, including fallback. Never silently use demo output or a paid model.
- Show actual scheduler state and results in monitoring; SSE remains a read-only delivery mechanism.

## Capabilities

### New Capabilities
- `autonomous-internal-learning`: bounded internal consolidation, free-only execution, validation and durable attempt history.

### Modified Capabilities
- `workflow-monitoring`: report autonomous scheduler state and persisted cycles without fabricating activity.

## Impact

Reuses NestJS feedback, AI orchestrator, knowledge, MongoDB, Qdrant, and existing monitoring. Adds no dependencies, queues, public crawling, publishing, model-weight training, or automatic promotion of manual analytics candidates. Existing per-feedback approval remains required. Automatic lesson acceptance is limited to the internal sources explicitly authorized here; approved prose is not evidence of measured effectiveness or causality. A finite corpus can legitimately become idle. Deployment remains a single persistent API replica with an explicit kill switch.
