## 1. Diagnostic DNA metadata

- [x] 1.1 Extend the optional Knowledge schema/parser/retrieval context with lesson type, diagnosis, root cause, recommended fix, failure dimensions, and evidence-source labels.
- [x] 1.2 Enrich the curated fixture with diagnosis fields for the existing positive and negative lessons, including the batik lesson.
- [x] 1.3 Update extraction and generation prompts so positive lessons guide and negative lessons diagnose; keep raw source content out of persistence and prompts after extraction.

## 2. Flexible reviewer and generation

- [x] 2.1 Replace persona-word blocking with a first-person context check and add regression cases for both forced and valid vocabulary.
- [x] 2.2 Allow evidence-backed or clearly hedged product observations while retaining a blocking warning for unsupported claims.
- [x] 2.3 Make the Observe → Wonder → Hypothesis → Reference → Open Question flow preferred guidance and add at least one alternate structure to generation instructions.

## 3. Project rules and verification

- [x] 3.1 Update `context/RULES.md`, `AGENTS.md`, and schema context with diagnosis-first OpenSpec and Ponytail rules, diversity requirements, and heuristic ceilings.
- [x] 3.2 Add regression tests for diagnosis fields, evidence provenance, and narrative diversity; keep every source file at or below 200 lines.
- [x] 3.3 Run `npm run check:lines`, `npm test`, `npm run build`, validate OpenSpec, seed/reindex metadata, sync specs, archive the change, and push the commit.
