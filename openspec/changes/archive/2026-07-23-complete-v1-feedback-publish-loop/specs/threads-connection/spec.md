## MODIFIED Requirements

### Requirement: Manual-publish boundary
Connecting or disconnecting a Threads account SHALL not publish, schedule, modify, or delete any Threads content. Publishing is allowed only through a separate explicit action for an approved narrative.

#### Scenario: Creator completes connection
- **WHEN** the OAuth callback succeeds
- **THEN** the system stores connection metadata only and publishes no external content

#### Scenario: Creator explicitly publishes approved narrative
- **WHEN** the creator invokes the publish action for an approved narrative with a valid connection
- **THEN** the system may publish that single text narrative and records the external publication ID
