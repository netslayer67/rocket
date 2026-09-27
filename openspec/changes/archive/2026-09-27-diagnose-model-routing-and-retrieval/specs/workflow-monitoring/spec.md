## ADDED Requirements

### Requirement: Safe routing and retrieval monitoring
Monitoring SHALL expose a compact failed-model outcome code and semantic retrieval state without prompts, sources, generated content, credentials, provider bodies, or vector data.

#### Scenario: Model candidate fails
- **WHEN** a persisted model run has a safe rejection code
- **THEN** the timeline displays the code alongside the candidate without exposing provider details

#### Scenario: Semantic retrieval completes
- **WHEN** a persisted narrative model run reports that semantic retrieval completed
- **THEN** monitoring exposes that compact retrieval state for the workflow map
