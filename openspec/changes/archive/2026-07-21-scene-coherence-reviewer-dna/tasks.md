## 1. Reviewer DNA

- [x] 1.1 Add high-confidence scene/object drift and abstract-observation smell checks to the existing reviewer.
- [x] 1.2 Add process-of-thought validation and include concise repair instructions in generation/rewrite prompts.
- [x] 1.3 Add regression tests for the neon-shoe rejection and community-shoe near-approval patterns.

## 2. Knowledge memory

- [x] 2.1 Insert positive and negative compact lesson metadata idempotently into production `knowledges` without raw source text.
- [x] 2.2 Reindex through the existing knowledge endpoint and verify pending/ready status.

## 3. Verification and release

- [x] 3.1 Sync the accepted delta into the main OpenSpec narrative, naturalness, and knowledge specs.
- [x] 3.2 Run `npm run check:lines`, `npm test`, and `npm run build`.
- [x] 3.3 Commit, push, deploy the API, verify production knowledge, and archive this change.
