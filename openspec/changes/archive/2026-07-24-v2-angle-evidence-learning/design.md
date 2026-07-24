## Context

The V2 backend already previews bounded public metadata, retrieves diagnosis-first DNA from Qdrant with lexical fallback, and routes every model call through `AiOrchestratorService`. The current suggestion endpoint returns one topic, so the studio cannot compare narrative directions or see why a direction is safe. The audit baseline is 62–65% readiness: the infrastructure is present, while reference understanding, evidence transparency, and outcome learning remain incomplete.

## Goals / Non-Goals

**Goals:**

- Expand `POST /narratives/suggestions` to return one recommended angle and up to two alternatives.
- Make each angle carry bounded confidence, a plain-language reason, and evidence labels derived from transient metadata.
- Keep topic, title, and selected angle editable in the existing Tailwind form.
- Preserve legacy single-topic clients and the manual approval boundary.
- Add contract tests without adding a dependency, queue, agent, or persistence field.

**Non-Goals:**

- Persisting fetched HTML, raw thread text, or model prompts.
- Automatically promoting analytics into DNA, publishing, crawling, replies, or model fine-tuning.
- Requiring one Observe → Wonder → Hypothesis sequence.

## Decisions

1. **Use one existing endpoint and orchestrator.** `NarrativesService.suggest` remains the boundary; the prompt requests structured JSON and `parseSuggestion` validates it. A new agent or service would increase coupling for a single response shape.
2. **Use a bounded `ReferenceAngle` contract.** Each angle has `title`, `confidence` (0–1), `reason`, and `evidence[]`; at most three angles are returned. The parser clamps and truncates values, so the UI never trusts arbitrary model output.
3. **Treat evidence as provenance labels, not claims.** Evidence values identify `reference-title`, `reference-description`, `reference-host`, or `metadata-only`. They never contain page body text and are not written to MongoDB or Qdrant.
4. **Keep backward compatibility.** A legacy `{topic}` response becomes a single low-confidence angle. The form still fills the topic and reference title exactly as before.
5. **Expose alternatives with native controls.** A compact select in the existing form keeps mobile behavior simple and reuses the current Tailwind tokens; no component library is added.

## Risks / Trade-offs

- [Risk] Metadata-only angles can be generic → show confidence/evidence and keep the fields editable; do not imply product facts.
- [Risk] Model returns malformed or repeated angles → parser validates, deduplicates, caps at three, and falls back to a safe demo angle.
- [Risk] Alternatives become a new formula → mark them as choices, not required sequence; preserve reviewer diagnosis and varied narrative shapes.
- [Risk] Historical audit metrics are mistaken for live telemetry → label them as governance context and validate current behavior with tests/build.

## Migration Plan

Deploy the API and web changes together. Existing clients continue to read `topic`; new clients read `recommendedAngle` and `alternativeAngles`. Rollback is a normal deployment revert because no database migration is required.

## Open Questions

Outcome-based DNA candidates and model benchmarking remain the next V2 gate after this slice; they require real analytics data and explicit approval policy.
