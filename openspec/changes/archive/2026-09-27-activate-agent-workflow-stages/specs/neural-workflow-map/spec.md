## ADDED Requirements

### Requirement: Honest per-agent waiting state
The monitoring map SHALL label every configured agent as either recently active or waiting based on persisted evidence and worker state. Waiting agents MUST NOT receive active color, active paths, or implied live processing.

#### Scenario: Agent has no qualifying event
- **WHEN** Learning Agent or Analytics Agent has no recent persisted qualifying event
- **THEN** its node remains muted and its accessible label states that it is waiting for evidence or outcomes

#### Scenario: Narrative stages occur
- **WHEN** recent persisted job events identify Reference, Knowledge, Narrative, and Reviewer ownership
- **THEN** only their matching nodes and related paths receive active styling
