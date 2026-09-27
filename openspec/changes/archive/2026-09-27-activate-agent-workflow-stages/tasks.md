## 1. Persisted agent-stage events

- [x] 1.1 Extend the existing narrative job event contract with optional agent ownership and preserve it in the bounded event history.
- [x] 1.2 Emit Reference, Knowledge, Narrative, and Reviewer ownership only at their actual generation stages.
- [x] 1.3 Normalize monitoring job events from owned stages with legacy fallback and cover both paths in tests.

## 2. Honest monitoring presentation

- [x] 2.1 Surface named ownership in studio progress and distinguish active from waiting agents in the workflow graph without synthetic activity.
- [x] 2.2 Record the frontend AI-Slop review and responsive/accessibility decision.

## 3. Verification

- [x] 3.1 Run `openspec validate activate-agent-workflow-stages --strict`, `npm run check:lines`, `npm test`, and `npm run build` with CI enabled.
