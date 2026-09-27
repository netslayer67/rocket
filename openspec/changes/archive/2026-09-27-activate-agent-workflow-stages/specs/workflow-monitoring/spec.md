## ADDED Requirements

### Requirement: Agent-owned job monitoring
Monitoring history and SSE snapshots SHALL normalize each persisted narrative job stage with its owned agent where available, and SHALL use Narrative Agent for legacy stage records without ownership.

#### Scenario: Owned job stage appears
- **WHEN** a persisted event for a narrative job identifies Reviewer Agent
- **THEN** monitoring emits that job as a Reviewer Agent event without exposing narrative content

#### Scenario: Legacy job appears
- **WHEN** a persisted event for a narrative job has no agent ownership
- **THEN** monitoring emits it as a Narrative Agent event
