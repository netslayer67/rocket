# Narrative Naturalness

## Purpose

Prevent predictable generic AI phrasing from reaching the manual approval queue while preserving concrete, discussion-led narrative drafts.
## Requirements
### Requirement: Generic AI anti-pattern detection
The system SHALL reject em dashes and a maintained deterministic set of generic contrast-reframing and filler patterns in narrative titles and bodies.

#### Scenario: Generic contrast framing is generated
- **WHEN** a generated draft contains a prohibited contrast-reframing phrase
- **THEN** the reviewer records a naturalness warning with the detected pattern

#### Scenario: Em dash is generated
- **WHEN** a generated draft contains an em dash
- **THEN** the reviewer records a naturalness warning

### Requirement: One bounded naturalness rewrite
The system SHALL request one rewrite through the AI Orchestrator when a live generated draft violates the anti-pattern library or a blocking narrative-quality gate.

#### Scenario: Rewrite resolves a blocker
- **WHEN** the rewritten draft no longer has a detected anti-pattern or quality-gate failure
- **THEN** the system stores the rewritten draft for ordinary manual review

#### Scenario: Rewrite still violates a gate
- **WHEN** the one allowed rewrite still has a detected anti-pattern or quality-gate failure
- **THEN** the system stores it as a draft with a blocking reviewer warning

### Requirement: Human voice and contextual-reference quality gate
The system SHALL block a draft that lacks a conversational first-person voice, does not reflect the selected persona's first-person vocabulary, presents a reference URL without a concrete textual bridge to its reference title, or contains a detected incompatible concrete scene.

#### Scenario: Draft sounds like an impersonal article
- **WHEN** a generated draft has no conversational first-person voice or uses an article-style headline
- **THEN** the reviewer records a blocking warning before manual approval

#### Scenario: Reference is appended without context
- **WHEN** a generated draft places a URL without mentioning its resolved reference context in the narrative
- **THEN** the reviewer records a blocking link-context warning

#### Scenario: Concrete scene details conflict
- **WHEN** a generated draft combines kite-flying with an unexplained floor setting
- **THEN** the reviewer records a blocking coherence warning and the existing one-rewrite path receives that warning

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
