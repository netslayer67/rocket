## MODIFIED Requirements

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
