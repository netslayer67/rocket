## 1. Reviewer and generation guardrails

- [x] 1.1 Add information-gap and generic-closing-question checks to the narrative reviewer.
- [x] 1.2 Pass topic and negative-pattern metadata into narrative generation and rewrite prompts.
- [x] 1.3 Add regression tests for the basketball-trade failure and a natural rewrite.

## 2. Learning metadata

- [x] 2.1 Insert the compact negative lesson idempotently into MongoDB without raw source text.
- [x] 2.2 Reindex the lesson through the existing knowledge indexing path.

## 3. Verification and release

- [x] 3.1 Run `npm run check:lines` and `npm test`.
- [ ] 3.2 Run `npm run build`, commit, push, and deploy the API.
- [ ] 3.3 Verify the reviewer blocks the reported failure and archive the OpenSpec change.
