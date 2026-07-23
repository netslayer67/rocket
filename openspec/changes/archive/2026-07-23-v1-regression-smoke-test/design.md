## Context

The V1 path is split across narrative jobs, review/approval, Threads publishing, feedback learning, and manual analytics. Existing tests cover individual services, but no single regression test proves that these contracts still compose. The test must remain deterministic and must not call Meta, OpenRouter, MongoDB, or Qdrant.

## Goals / Non-Goals

**Goals:**

- Compose existing services with small in-memory fakes.
- Verify the persisted-draft-before-SSE-complete contract.
- Verify approval gating, external publication ID persistence, idempotent feedback learning, and analytics formulas.
- Keep dynamic approve and publish paths explicit in the Vercel filesystem adapter; both delegate to the same Nest application handler.
- Keep Threads container creation unchanged and place `creation_id` in the publish request query string.

**Non-Goals:**

- Replacing production smoke verification.
- Making external Threads posts in CI.
- Adding a test framework, fixture library, or new runtime abstraction.

## Decisions

- Add one Jest spec under `apps/api/src` because Jest and ts-jest already exist.
- Use existing service classes where their boundaries are stable; provide tiny object fakes for persistence and external services.
- Keep the scenario data synthetic and metadata-only. No imported thread body or token is stored.
- Assert the same sequence the dashboard uses: saved narrative → complete SSE event → approve → publish → feedback learning → analytics summary.

## Risks / Trade-offs

- [Risk] Fakes can diverge from production adapters → Mitigation: assert public service contracts and keep the production publish smoke test separate.
- [Risk] One broad test can be harder to diagnose → Mitigation: name each stage assertion and fail at the first broken contract.
- [Risk] In-process jobs remain non-durable → Mitigation: preserve the existing `ponytail:` ceiling; durable recovery belongs to V2.
- [Risk] Provider request contracts can drift → Mitigation: production smoke test the real publish path and keep the query shape covered in the service implementation.
