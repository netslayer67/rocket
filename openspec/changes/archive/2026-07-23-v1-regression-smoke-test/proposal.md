## Why

V1 now has the complete creator flow, but production verification is still manual and easy to regress. A small regression smoke test should prove the critical path from persona and knowledge import through SSE generation, approval, Threads publishing, diagnosis-first learning, and manual analytics.

## What Changes

- Add one API-level smoke test that exercises the V1 flow with existing service contracts and deterministic fakes.
- Expose explicit Vercel adapters for dynamic approve and publish actions so the production path matches the Nest routes.
- Send Threads `creation_id` using the publish endpoint's query contract.
- Assert SSE lifecycle completion only after a persisted draft is returned.
- Assert approval is required before publishing and that a published external ID is stored.
- Assert explicitly approved positive and negative feedback creates idempotent DNA and reindex-ready metadata.
- Assert manual analytics returns the expected CTR and engagement rate.
- Keep the test offline; no real Threads post or external network call runs in CI.

## Capabilities

### New Capabilities

- `v1-regression-smoke`: Offline regression coverage for the V1 end-to-end contract.

### Modified Capabilities

- Additive Vercel routing and Threads publish request-shape fixes required by the production smoke path.

## Impact

The test lives under `apps/api` and uses existing Jest tooling and service boundaries. Production smoke verification remains an operator action because publishing changes external state; CI uses fakes and never stores raw source content. The routing adapters only re-export the existing Nest handler; they do not bypass review or persistence.
