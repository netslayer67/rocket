## ADDED Requirements

### Requirement: Generic AI anti-pattern detection
The system SHALL reject em dashes and a maintained deterministic set of generic contrast-reframing and filler patterns in narrative titles and bodies.

#### Scenario: Generic contrast framing is generated
- **WHEN** a generated draft contains a prohibited contrast-reframing phrase
- **THEN** the reviewer records a naturalness warning with the detected pattern

#### Scenario: Em dash is generated
- **WHEN** a generated draft contains an em dash
- **THEN** the reviewer records a naturalness warning

### Requirement: One bounded naturalness rewrite
The system SHALL request one rewrite through the AI Orchestrator when a live generated draft violates the anti-pattern library.

#### Scenario: Rewrite removes the prohibited pattern
- **WHEN** the rewritten draft no longer has a detected anti-pattern
- **THEN** the system stores the rewritten draft for ordinary manual review

#### Scenario: Rewrite still violates the library
- **WHEN** the one allowed rewrite still has a detected anti-pattern
- **THEN** the system stores it as a draft with a blocking reviewer warning
