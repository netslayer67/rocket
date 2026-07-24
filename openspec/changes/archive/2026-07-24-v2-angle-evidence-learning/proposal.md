## Why

Scope V2 is functionally useful but only about 62–65% ready as a narrative-intelligence engine. The historical Executive Summary correctly identified missing multi-angle discovery, evidence provenance, reviewer diagnosis, and outcome signals, but its implementation-status notes are stale because Qdrant, SSE, centralized orchestration, positive/negative DNA, and bounded manual crawling already exist. We need a verified, incremental V2 slice that turns shallow link suggestions into editable, evidence-aware narrative angles without overfitting a fixed writing formula.

## What Changes

- Return a recommended angle plus up to two alternatives from the existing reference-suggestion flow.
- Attach confidence, reason, and evidence provenance to every angle; evidence is transient reference metadata only.
- Preserve the legacy single-topic response as a compatibility fallback.
- Let the studio choose an angle before generation while keeping all fields editable and manual approval intact.
- Add regression coverage for valid, incomplete, and legacy suggestion responses.
- Record the V2 audit as governance: diagnosis-first DNA, no vocabulary blacklist, no mandatory reasoning sequence, and a Ponytail ceiling against speculative agents, queues, or dependencies.

Non-goals: automatic publishing, unattended crawling, raw-source storage, automatic DNA promotion from analytics, model fine-tuning, replies, or a new agent/service layer.

## Capabilities

### New Capabilities

- `reference-angle-discovery`: Evidence-aware, multi-angle suggestions derived from bounded reference metadata.

### Modified Capabilities

- `reference-suggestions`: Expand the API contract from one topic to a recommended angle and alternatives while retaining compatibility.
- `narrative-authenticity-review`: Require evidence provenance for angle claims without turning vocabulary or one narrative sequence into a blacklist.

## Impact

`NarrativesService` and parsers gain a bounded suggestion contract; the existing AI orchestrator remains the only LLM boundary. The Next.js form gains an angle selector. Tests and OpenSpec specs document the 62–65% baseline, stale-audit reconciliation, V2 exit criteria, and manual-approval boundary. No new dependency, queue, agent, or persistence field is required.
