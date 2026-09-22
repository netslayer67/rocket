## MODIFIED Requirements

### Requirement: Thinking-style persona context
The system SHALL persist optional thinking style, observation style, reasoning pattern guidance, core identity, claim boundaries, and current interests in the one active persona and SHALL derive one versioned voice contract from its active identity, tone, thinking, observation, claim-boundary, and current-interest fields for every interactive narrative route. Vocabulary MUST remain contextual guidance rather than a quota, and identity MUST NOT be treated as evidence of lived experience.

#### Scenario: Active persona has profile guidance
- **WHEN** the active persona includes identity, thinking, observation, claim-boundary, or current-interest guidance
- **THEN** generated narratives, rewrites, and reference suggestions use it as the same optional voice contract while retaining alternate valid structures and factual-evidence limits

#### Scenario: Legacy persona has only current fields
- **WHEN** an existing persona has only its current fields
- **THEN** it remains readable and can be adopted once as the active profile with existing tone and vocabulary defaults
