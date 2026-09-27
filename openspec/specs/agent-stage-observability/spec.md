# Agent Stage Observability

## Purpose

Make actual narrative workflow ownership observable from the compact persisted job history without adding background work or retaining sensitive content.

## Requirements

### Requirement: Persisted narrative-stage ownership
The API SHALL attach a compact named agent to each actual narrative job stage that performs reference resolution, knowledge retrieval, model drafting, or review. The event payload MUST contain only lifecycle metadata and MUST NOT contain raw sources, prompts, generated bodies, credentials, or provider error bodies.

#### Scenario: Draft with an input reference
- **WHEN** a narrative job resolves at least one supplied reference and continues through retrieval, generation, and review
- **THEN** its persisted event history contains Reference Agent, Knowledge Agent, Narrative Agent, and Reviewer Agent stage records

#### Scenario: Draft without an input reference
- **WHEN** a narrative job has no supplied reference
- **THEN** it does not create a synthetic Reference Agent activity event

### Requirement: Backward-compatible job stream
The narrative job SSE payload SHALL expose optional agent ownership while legacy events without ownership remain valid.

#### Scenario: Legacy job is read
- **WHEN** a stored job event has no agent field
- **THEN** the client can still render its lifecycle stage and progress
