## 1. Review diagnostics

- [x] 1.1 Add a pure mapper from reviewer notes to stable dimension/severity/code diagnostics.
- [x] 1.2 Include diagnostics in narrative list responses without changing stored raw notes.
- [x] 1.3 Add regression tests for blocking, unknown, and clean notes.

## 2. Outcome candidates

- [x] 2.1 Add a bounded analytics insight aggregation with transparent rates and candidate status.
- [x] 2.2 Add `GET /analytics/insights` and skip orphaned narrative rows safely.
- [x] 2.3 Add API tests for grouped metrics, zero views, and orphan rows.

## 3. Studio surface

- [x] 3.1 Load outcome candidates in the existing studio hook and render them with current Tailwind primitives.
- [x] 3.2 Keep manual source, sample size, candidate status, and no-auto-promotion copy visible.
- [x] 3.3 Review the UI against `context/AI-SLOP.md` without adding chart or UI dependencies.

## 4. Verification and handoff

- [x] 4.1 Run `npm run check:lines` and confirm the 200-line ceiling.
- [x] 4.2 Run `npm test` and `npm run build`.
- [x] 4.3 Sync and archive the OpenSpec change; record remaining model-benchmarking and automatic-DNA gaps.
