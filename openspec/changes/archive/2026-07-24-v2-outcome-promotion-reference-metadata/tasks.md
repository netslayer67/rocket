## 1. Outcome promotion

- [x] 1.1 Add validated promotion DTO and explicit analytics promotion endpoint.
- [x] 1.2 Reuse KnowledgeService to create a diagnosis-first lesson with manual provenance and idempotent narrative linkage.
- [x] 1.3 Expose candidate/promoted status and compact confirmation controls in the analytics panel.
- [x] 1.4 Add service tests for positive, negative, missing-approval, no-candidate, and repeated-promotion scenarios.

## 2. Reference understanding

- [x] 2.1 Extract bounded optional type, site, author, section, date, price, currency, and canonical metadata.
- [x] 2.2 Pass enriched transient metadata to angle suggestion and narrative generation prompts.
- [x] 2.3 Add metadata extraction and prompt-context regression tests, including absent metadata and no raw-body persistence.

## 3. Governance and verification

- [x] 3.1 Update main OpenSpec specs, context documents, V2 audit, and AI-Slop review record.
- [x] 3.2 Run `npm run check:lines`, `npm test`, `npm run build`, and `openspec validate --all --strict`.
- [x] 3.3 Archive this change after all checks pass.
