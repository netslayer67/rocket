## ADDED Requirements

### Requirement: Human voice and contextual-reference quality gate
The system SHALL block a draft that lacks a conversational first-person voice, does not reflect the selected persona's first-person vocabulary, or presents a reference URL without a concrete textual bridge to its reference title.

#### Scenario: Draft sounds like an impersonal article
- **WHEN** a generated draft has no conversational first-person voice or uses an article-style headline
- **THEN** the reviewer records a blocking warning before manual approval

#### Scenario: Reference is appended without context
- **WHEN** a generated draft places a URL without mentioning its resolved reference context in the narrative
- **THEN** the reviewer records a blocking link-context warning

## MODIFIED Requirements

### Requirement: One bounded naturalness rewrite
The system SHALL request one rewrite through the AI Orchestrator when a live generated draft violates the anti-pattern library or a blocking narrative-quality gate.

#### Scenario: Rewrite resolves a blocker
- **WHEN** the rewritten draft no longer has a detected anti-pattern or quality-gate failure
- **THEN** the system stores the rewritten draft for ordinary manual review

#### Scenario: Rewrite still violates a gate
- **WHEN** the one allowed rewrite still has a detected anti-pattern or quality-gate failure
- **THEN** the system stores it as a draft with a blocking reviewer warning
