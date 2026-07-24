## Context

Manual analytics and reviewer notes already exist, but they are isolated: a creator can see a total CTR and a list of prose warnings, not a reviewable link between narrative dimensions and measured outcomes. V2 needs observability without pretending that a few operator-entered rows are platform truth.

## Goals / Non-Goals

**Goals:**

- Return stable, diagnosis-first reviewer diagnostics derived from existing notes.
- Aggregate up to the existing bounded analytics window per narrative and expose read-only outcome candidates.
- Keep source labeling manual, rates transparent, and DNA promotion explicit.
- Render candidates in the existing analytics panel with semantic HTML and current Tailwind primitives.

**Non-Goals:**

- Automatic DNA creation, attribution, platform API ingestion, trend forecasting, or statistical significance claims.
- A new agent, queue, dependency, persistence collection, or reviewer rewrite loop.

## Decisions

1. **Derive diagnostics from current notes.** A pure mapper in `narrative-diagnostics.ts` gives stable codes without rewriting the deterministic reviewer. Notes remain the human-readable source of truth.
2. **Aggregate in memory from bounded rows.** `AnalyticsService.insights` groups the same recent manual rows used by summary, then joins narrative metadata. This avoids a migration and keeps the candidate explicitly provisional.
3. **Use a read-only endpoint.** `GET /analytics/insights` returns candidates with `status: candidate`; it never writes DNA or changes feedback approval.
4. **Reuse the existing panel.** A compact list shows title, link placement, sample size, CTR, and engagement. No chart library or new visual system is introduced.

## Risks / Trade-offs

- [Risk] Small samples look authoritative → expose `sampleSize`, manual source, and candidate status; do not rank as a winner.
- [Risk] Old notes cannot map to a code → use `OTHER_REVIEW_NOTE` with dimension `narrative`.
- [Risk] Aggregated rows may mix captures → show sample size and retain the existing 100-row bound.
- [Risk] UI becomes another dashboard card → render only when candidates exist and keep it subordinate to the manual capture workflow.

## Migration Plan

Deploy API and web together. No database migration is required. Roll back by reverting the deployment; existing analytics and notes remain valid.

## Open Questions

Minimum sample thresholds, model benchmarking, and automatic DNA promotion remain V2 exit decisions that require real outcome data and explicit approval policy.
