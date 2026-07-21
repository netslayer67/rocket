## 1. Serverless-safe state validation

- [x] 1.1 Remove process-local OAuth state storage and validate callback state against the state cookie.
- [x] 1.2 Update service tests for matching, missing, and mismatched state values.

## 2. Verification and release

- [x] 2.1 Run `npm run check:lines` and `npm test`.
- [x] 2.2 Run `npm run build`, commit, and deploy the API production target.
- [ ] 2.3 Verify production callback behavior with a fresh OAuth flow and archive the OpenSpec change.
