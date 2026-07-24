## 1. Governance

- [x] 1.1 Record the 62–65% V2 readiness baseline, stale Executive Summary findings, alignment gaps, V2 priorities, and Ponytail ceiling in project context.
- [x] 1.2 Validate proposal, design, and delta specs with OpenSpec before implementation.

## 2. API contract

- [x] 2.1 Add bounded `ReferenceAngle` and suggestion types with confidence, reason, and evidence provenance.
- [x] 2.2 Parse, clamp, deduplicate, and cap model angles while preserving legacy `{topic}` compatibility.
- [x] 2.3 Update the orchestrator prompt and demo fallback to request metadata-only multi-angle JSON.
- [x] 2.4 Add API regression tests for valid, malformed, duplicate, and legacy suggestion responses.

## 3. Studio experience

- [x] 3.1 Update the web suggestion type and form to display selectable recommended and alternative angles.
- [x] 3.2 Keep topic, reference title, and selected angle editable with accessible status copy.
- [x] 3.3 Review the UI against `context/AI-SLOP.md` and existing Tailwind tokens without adding dependencies.

## 4. Verification and handoff

- [x] 4.1 Run `npm run check:lines` and confirm every source file remains at or below 200 lines.
- [x] 4.2 Run `npm test` and `npm run build`.
- [x] 4.3 Validate and archive the OpenSpec change after implementation; document outcome-learning and model-benchmarking as the next V2 gate.
