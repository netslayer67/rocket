## MODIFIED Requirements

### Requirement: Manual approval remains explicit
The dashboard SHALL show reviewer notes before a draft can be approved, SHALL disable approval for a draft with any blocking reviewer warning, and SHALL not publish to an external platform.

#### Scenario: Creator approves a draft
- **WHEN** the creator chooses manual approval on a draft without a blocking reviewer warning
- **THEN** the dashboard marks it approved through the API without sending it to an external platform

#### Scenario: Draft fails a quality gate
- **WHEN** the reviewer records a blocking naturalness, human-voice, or link-context warning
- **THEN** the dashboard shows the warning and keeps the manual approval action unavailable
