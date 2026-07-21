# Narrative Naturalness

## MODIFIED Requirements

### Requirement: Human voice and contextual-reference quality gate
The system SHALL block a draft that lacks a conversational first-person voice, does not reflect the selected persona's first-person vocabulary, presents a reference URL without a concrete textual bridge to its reference title, contains a detected incompatible concrete scene, or uses abstract AI-smell language in place of a specific observation.

#### Scenario: Draft sounds like an impersonal article
- **WHEN** a generated draft has no conversational first-person voice or uses an article-style headline
- **THEN** the reviewer records a blocking warning before manual approval

#### Scenario: Reference is appended without context
- **WHEN** a generated draft places a URL without mentioning its resolved reference context in the narrative
- **THEN** the reviewer records a blocking link-context warning

#### Scenario: Concrete scene details conflict
- **WHEN** a generated draft combines kite-flying with an unexplained floor setting
- **THEN** the reviewer records a blocking coherence warning and the existing one-rewrite path receives that warning

#### Scenario: Abstract AI smell replaces observation
- **WHEN** a generated draft uses generic metaphor or adjective language such as “menambahkan dimensi visual”, “dramatis”, or “punya rahasia tersendiri”
- **THEN** the reviewer records a blocking naturalness warning

### Requirement: Information-gap and discussion quality gate
The system SHALL block a draft when its opening has no concrete curiosity or tension cue, when a broad closing question is the only discussion mechanism, or when it has no visible uncertainty/process-of-thought cue and no concrete first-person observation.

#### Scenario: Draft reads like a news summary
- **WHEN** the title or opening has no first-person observation and contains no specific curiosity cue
- **THEN** the reviewer records a blocking information-gap warning before approval

#### Scenario: Closing question is generic
- **WHEN** a draft ends with a broad prompt such as “menurut kamu?” without a specific unresolved detail
- **THEN** the reviewer records a blocking discussion-quality warning

#### Scenario: Draft carries a specific unresolved detail
- **WHEN** the opening contains a concrete observation or curiosity cue and the body leaves a meaningful tension unresolved
- **THEN** the reviewer does not add the information-gap warning

#### Scenario: Draft shows active thinking
- **WHEN** the body includes a first-person observation or a cue such as “gw kira”, “awalnya”, “jangan-jangan”, “belum yakin”, or “baru kepikiran”
- **THEN** the reviewer does not add the human-thinking warning
