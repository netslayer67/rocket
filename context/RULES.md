# Engineering Rules

## Required constraints

1. A source-code file must contain at most 200 lines. Split by responsibility before it crosses the limit. `npm run check:lines` enforces this.
2. Every LLM request goes through `AiOrchestratorService`; no exception.
3. Validate user input at API boundaries and keep automatic publishing behind explicit approval.
4. Do not store a raw imported thread. Persist only extracted pattern metadata.
5. Avoid sales CTAs. A link is a contextual reference.
6. Generate embeddings only through `AiOrchestratorService`; Qdrant stores vector IDs and Mongo knowledge IDs, never raw sources.
7. Keep one embedding model per Qdrant collection. Create a new collection and reindex when vector dimensions change.
8. Crawling is manual in V1: obey robots.txt, reject non-public targets, bound domain/rate/size/page count, and never retain raw fetched content or Nutch artifacts.
9. Every new or materially changed `apps/web` UI surface MUST pass the strict anti-slop, accessibility, responsive, and motion checklist in `context/AI-SLOP.md`.
10. Generic AI UI patterns are not defaults. A deliberate exception MUST record user value, simpler alternative, scope, and rollback condition.
11. Do not add a UI dependency, icon library, detector, token system, or visual-regression service for speculative future needs; follow the Ponytail rules and reuse existing Tailwind primitives.
12. Narrative reviewer rules must diagnose context, evidence, and reasoning; a vocabulary term alone is never a blocking reason.
13. Knowledge DNA records should include lesson type, diagnosis, root cause, recommended fix, failure dimensions, and evidence sources when known. Store metadata only.
14. Preferred narrative flows are optional guidance. Keep alternate shapes valid so generation does not converge on one recognizable template.
15. V1 learning is opt-in and idempotent: only explicitly approved structured feedback can create DNA, and a scheduler never publishes content.
16. V1 analytics are operator-entered signals. Label them as manual and return null rates when views are zero; never invent platform measurements.

## V2 audit guardrails

The historical V2 readiness estimate is 62–65% overall (core retrieval infrastructure is further along). Treat the Executive Summary as a dated audit, not live status: verify claims against code, tests, and deployed behavior before changing architecture. Its accurate gaps are multi-angle reference discovery, evidence provenance, structured reviewer diagnosis, outcome-linked learning candidates, and model evaluation; Qdrant, SSE, OpenRouter orchestration, positive/negative DNA, and bounded manual crawlers already exist.

17. V2 suggestions MUST expose a recommended angle plus bounded alternatives, confidence, reason, and evidence provenance while keeping fields editable.
18. DNA learning is diagnosis-first: capture symptom, root cause, fix, dimensions, and evidence. Never turn persona vocabulary into a standalone blacklist or make one reasoning sequence mandatory.
19. Analytics may propose an outcome-learning candidate, but promotion to DNA remains explicit and reviewable; preserve sample/provenance context, avoid causal claims, and never silently self-train or invent platform metrics.
20. Ponytail ceiling: do not add an agent, queue, dependency, or service split for a single V2 slice. Reuse the existing service/orchestrator until a second independent source or measured bottleneck justifies extraction.
21. Outcome promotion requires `approved: true`, a positive/negative lesson type, manual provenance, a diagnosis, and an idempotent narrative-to-DNA link. A manual sample is observational, never causal.
22. Reference previews may expose bounded type, site, author, section, date, price, currency, and canonical metadata; omit absent values and never persist or log page bodies.

## OpenSpec workflow

For a meaningful feature, behavior change, or architecture change:

1. Create an OpenSpec change with a concise proposal, design, specs, and tasks.
2. Implement only approved tasks and tick them as they finish.
3. Sync the accepted delta specs into `openspec/specs/`.
4. Archive the completed change.

Use the project-local `.codex/skills/openspec-*` skills. Project context lives in this directory.

## Ponytail workflow

Use the first solution that is both safe and sufficient: reuse local code, then standard library, native browser/platform capability, installed dependencies, and finally new code. Do not add a dependency or abstraction for a single use.

If a deliberate shortcut has a known ceiling, add a `ponytail:` comment with the upgrade condition.

For narrative heuristics, Ponytail means one small contextual check before a word list. A narrow lexical check is allowed only with a `ponytail:` ceiling and a reviewed-example threshold before broadening it. Do not add a detector dependency for this.

For UI, Ponytail means deleting decorative layers before adding them: prefer semantic HTML, native CSS, existing Tailwind classes, and one clear hierarchy. A new component or token is justified only when the same treatment is used in at least two workflows.

## Verification

Run these before handing off implementation:

```text
npm run check:lines
npm test
npm run build
```

## Code shape

- One clear responsibility per file.
- Prefer named data types and small pure helpers.
- Keep components accessible: labels, keyboard-safe controls, and text status.
- Do not edit generated OpenSpec skill files.
- Treat `vectorStatus: pending` as recoverable; reindex rather than asking a creator to resubmit a source.
