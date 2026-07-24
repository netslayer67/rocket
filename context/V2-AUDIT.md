# Scope V2 Audit

## Baseline and current assessment

The Executive Summary estimated V2 readiness at 62–65% before the latest work. That was a readiness estimate, not a test score. The core retrieval infrastructure was already further along because Qdrant hybrid retrieval, SSE generation, centralized orchestration, positive/negative DNA, and bounded manual crawlers were implemented.

After the latest audited slices, including explicit outcome promotion and reference enrichment, the practical V2 readiness is approximately **90%**:

- Reference discovery: multi-angle suggestions, bounded confidence, reason, and metadata-only evidence are live.
- Knowledge retrieval: semantic plus lexical fallback and retrieval observability are live.
- Narrative quality: deterministic checks, one bounded rewrite, diagnosis-first DNA, and stable reviewer diagnostics are live.
- Outcome loop: manual analytics produce grouped, read-only candidates with CTR, engagement, sample size, and narrative context.
- Outcome promotion: an explicit typed approval creates one diagnosis-first DNA lesson and links it idempotently to the narrative.
- Reference understanding: bounded type/site/author/section/date/price/canonical metadata is available transiently to suggestions and generation.
- Governance: Ponytail ceilings, anti-slop review, OpenSpec deltas, and line/test/build gates are enforced.

This is not 100% because the remaining items require real production data or a deliberate V2/V3 boundary decision.

## Executive Summary reconciliation

Historical findings that remain valid:

- One angle was too narrow; the studio now offers alternatives.
- Reference understanding was shallow; metadata evidence is now explicit, but extraction is still bounded.
- Reviewer notes were opaque; list responses now expose stable codes, dimensions, and severity.
- Analytics did not feed a reviewable learning signal; outcome candidates now exist without silent DNA promotion.
- Persona must model thinking style, not only vocabulary; this remains a quality gate.

Findings that were stale and must not drive duplicate work:

- Qdrant and hybrid retrieval already exist.
- SSE generation and automatic review-queue insertion already exist.
- OpenRouter calls already pass through the orchestrator.
- Positive and negative DNA already seed the knowledge library.
- Scrapy/Nutch support is manual and bounded, as required by the current boundary.

## Guardrails for the remaining work

1. Do not turn vocabulary into a blacklist or make one Observe → Wonder → Hypothesis flow mandatory.
2. Do not auto-promote an analytics candidate into DNA; require explicit feedback approval and preserve the sample/provenance context before later generalization.
3. Do not claim platform analytics, causation, or model superiority from manual samples.
4. Do not add an agent, queue, dependency, or service split for one narrow heuristic. Reuse the existing orchestrator and modules until a measured bottleneck or second source justifies extraction.
5. Keep all reference bodies, imported threads, prompts, and credentials transient or encrypted as already defined in the context rules.

## V2 exit criteria

- [x] Multi-angle, editable reference suggestions with provenance.
- [x] Hybrid retrieval and bounded context logging.
- [x] Diagnosis-first review with positive and negative lessons.
- [x] Structured reviewer diagnostics and manual outcome candidates.
- [x] Manual approval boundary, SSE generation, and regression/build gates.
- [ ] Model benchmark history and evidence-based routing.
- [x] Outcome candidates promoted to DNA only through an explicit, reviewed learning decision.
- [x] Richer reference understanding beyond title/description through bounded safe metadata.

The next V2 work should address the unchecked items only after real analytics samples exist; otherwise they remain documented extension points rather than speculative architecture.
