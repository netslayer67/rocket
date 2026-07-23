## Context

V1 already has Mongo-backed narratives, encrypted Threads OAuth, diagnosis-first knowledge retrieval, and a manual approval queue. It has no controlled way to publish an approved draft, persist structured outcome data, or turn a review into a reusable lesson. The design must keep the current single-account boundary, avoid raw source retention, and keep every source file below 200 lines.

## Goals / Non-Goals

**Goals:**

- Publish one approved text narrative through the official two-step Threads API flow.
- Capture reviewer dimensions and only learn from feedback explicitly marked for learning.
- Store compact analytics metadata and derive CTR and engagement rates.
- Run pending learning on demand and through a simple daily in-process tick.
- Add persona thinking/observation fields to generation and reviewer context.

**Non-Goals:**

- No automatic publishing, scheduling of posts, media/carousel support, replies, or platform scraping.
- No BullMQ/Redis dependency in V1; the scheduler is intentionally bounded to one process.
- No raw imported threads, full screenshots, or prompt/source copies in knowledge, analytics, or logs.

## Decisions

1. **Manual Threads publish in `ThreadsService`.** Add token decryption and a text-only create-container then publish call. `NarrativesService.publish` checks approval, calls the Threads service, and stores only the external ID/time. This reuses the existing encrypted connection and keeps the boundary explicit. A separate publisher abstraction is unnecessary for one platform in V1.
2. **Feedback is structured metadata.** A feedback record references a narrative and stores bounded dimension scores, a short diagnosis note, and `approvedForLearning`. `LearningService` converts an approved record into a compact negative or positive Knowledge document and indexes it through the existing service. Notes are not copied into a source field.
3. **Analytics are manual capture.** A small analytics schema accepts platform metrics and computes CTR and engagement rate. This provides a truthful V1 signal without inventing platform insight permissions or link tracking. The API returns a summary for the dashboard.
4. **Daily learning uses native timers.** `LearningService` exposes `runPending()` and starts a 24-hour `setInterval` only when enabled. A Ponytail ceiling comment documents the upgrade to a durable queue when multiple instances or guaranteed execution are required.
5. **Thinking style is optional context.** Persona records gain `thinkingStyle`, `observationStyle`, and `reasoningPatterns`; prompts pass them as guidance. Reviewer checks remain contextual and do not turn these fields into keyword quotas or a mandatory sequence.
6. **UI reuses existing Tailwind surfaces.** Add only labeled controls and text status to the current narrative queue and persona form. No dependency or decorative layer is introduced.

## Risks / Trade-offs

- [Threads token expires] → return a clear manual reconnect error; do not silently publish with stale credentials.
- [Process restarts before daily tick] → expose the same run as a manual endpoint; move to BullMQ only when durability is required.
- [Feedback overfits one reviewer] → require explicit learning approval, preserve positive and negative lesson types, and keep diagnosis dimensions visible.
- [Manual metrics are incomplete] → label them as operator-entered and keep zero/unknown values distinct from measured zero.

## Migration Plan

Deploy schema additions as optional fields, add the endpoints, then seed no automatic learning. Existing narratives remain drafts or approved. Operators can add feedback, run learning, approve a draft, and publish manually. Rollback is code rollback; optional metadata can remain harmlessly in Mongo.

## Open Questions

None for V1. Official analytics ingestion, durable scheduling, and multi-post publishing remain V2/V3 decisions.
