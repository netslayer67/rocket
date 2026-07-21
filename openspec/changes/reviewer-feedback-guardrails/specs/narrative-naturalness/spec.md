## ADDED Requirements

### Requirement: Information-gap and discussion quality gate
The system SHALL block a draft when its opening has no concrete curiosity or tension cue, or when a broad closing question is the only discussion mechanism.

#### Scenario: Draft reads like a news summary
- **WHEN** the title or opening has no first-person observation and contains no specific curiosity cue
- **THEN** the reviewer records a blocking information-gap warning before approval

#### Scenario: Closing question is generic
- **WHEN** a draft ends with a broad prompt such as “menurut kamu?” without a specific unresolved detail
- **THEN** the reviewer records a blocking discussion-quality warning

#### Scenario: Draft carries a specific unresolved detail
- **WHEN** the opening contains a concrete observation or curiosity cue and the body leaves a meaningful tension unresolved
- **THEN** the reviewer does not add the information-gap warning
