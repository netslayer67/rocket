## MODIFIED Requirements

### Requirement: Thinking-style persona context
The system SHALL persist optional thinking style, observation style, reasoning pattern guidance, core identity, claim boundaries, and current interests in the one active persona and SHALL pass them to narrative generation without treating vocabulary as a quota or treating identity as evidence of lived experience.

#### Scenario: Active persona has profile guidance
- **WHEN** the active persona includes identity, thinking, observation, claim-boundary, or current-interest guidance
- **THEN** generated narratives use it as optional context while retaining alternate valid structures and factual-evidence limits

#### Scenario: Legacy persona has only current fields
- **WHEN** an existing persona has only its current fields
- **THEN** it remains readable and can be adopted once as the active profile with existing tone and vocabulary defaults
