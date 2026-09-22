## ADDED Requirements

### Requirement: Product-title and generic-template guard
The system SHALL reject a returned product angle that merely repeats the normalized reference title or uses a known generic angle template without a concrete human tension. It MUST retain at most three editable angles and must not use a persona vocabulary word as a standalone rejection rule.

#### Scenario: Model repeats marketplace title
- **WHEN** a model returns an angle that copies the product listing title into “hal kecil”, “sudut lain”, or similarly generic framing
- **THEN** the parser discards that angle and uses the safe metadata-only fallback when no grounded angle remains

#### Scenario: Model returns a concrete tension
- **WHEN** an angle identifies a bounded human situation without unsupported product claims
- **THEN** the parser retains it even if the reference remains metadata-only
