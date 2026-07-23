# Persona Engine

## Purpose

Keep persona guidance focused on how a narrator notices and reasons, not only on vocabulary.

## Requirements

### Requirement: Thinking-style persona context
The system SHALL persist optional thinking style, observation style, and reasoning pattern guidance in a persona and SHALL pass it to narrative generation without treating vocabulary as a quota.

#### Scenario: Persona has thinking guidance
- **WHEN** a persona includes thinking and observation guidance
- **THEN** generated narratives use it as optional reasoning context while retaining alternate valid structures

#### Scenario: Persona has no new guidance
- **WHEN** an existing persona has only its current fields
- **THEN** generation continues using existing tone and vocabulary defaults
