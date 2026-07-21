## 1. Curated metadata

- [x] 1.1 Add two metadata-only DNA records for the clinic-warning and low-budget-coffee patterns.
- [x] 1.2 Add an idempotent Mongo seed script and package command.

## 2. Verification and handoff

- [x] 2.1 Run the seed against the configured MongoDB and reindex the new records.
- [x] 2.2 Run `npm run check:lines`, `npm test`, and `npm run build`.
- [x] 2.3 Sync specs into `openspec/specs/`, archive the change, and push the commit.
