## ADDED Requirements

### Requirement: V1 regression smoke coverage
The repository SHALL provide an offline Jest regression test that composes the V1 narrative, approval, publishing, learning, and analytics contracts in order.

#### Scenario: Complete V1 path succeeds
- **WHEN** the smoke test creates a persona context, imports compact DNA metadata, runs a narrative job, and observes its events
- **THEN** the saved narrative is available before the `complete` event and the test continues through review, approval, publish, feedback learning, and analytics assertions

#### Scenario: Publishing remains approval-gated
- **WHEN** the smoke test attempts to publish a draft before approval
- **THEN** publishing is rejected and no external publication ID is stored

#### Scenario: Learning is idempotent and ready for indexing
- **WHEN** explicitly approved positive and negative feedback is processed and the same feedback is processed again
- **THEN** each feedback item creates at most one diagnosis-first lesson, the lesson metadata is reindex-ready, and the repeat run is skipped

#### Scenario: Manual analytics formulas are stable
- **WHEN** the smoke test records views, clicks, likes, replies, reposts, and quotes
- **THEN** the summary returns the expected CTR and engagement rate and labels the source as manual

#### Scenario: Production action routes resolve
- **WHEN** the production API receives `PATCH /api/narratives/:id/approve` or `POST /api/narratives/:id/publish`
- **THEN** Vercel resolves both actions to the existing Nest controller without bypassing approval or persistence

#### Scenario: Threads publish uses the documented container contract
- **WHEN** an approved narrative is published to Threads
- **THEN** the `creation_id` returned by container creation is sent as the publish endpoint query parameter and the returned thread ID is persisted
