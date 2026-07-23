## 1. Regression coverage

- [x] 1.1 Add the offline V1 composition test using existing service contracts and small in-memory fakes.
- [x] 1.2 Assert SSE completion ordering, approval gating, publication ID persistence, feedback idempotency, reindex-ready lesson metadata, and manual analytics formulas.
- [x] 1.3 Add explicit Vercel adapters for dynamic approve and publish actions and align the Threads publish request shape.

## 2. Verification

- [x] 2.1 Run the focused smoke test and the full API test suite.
- [x] 2.2 Run `npm run check:lines` and `npm run build`.
- [x] 2.3 Record the production publish, learning, Qdrant, and analytics smoke-test results without persisting tokens or raw source content.
- [x] 2.4 Sync and archive this OpenSpec change after all checks pass.
