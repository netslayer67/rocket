# Narrative Naturalness

## Purpose

Prevent predictable generic AI phrasing from reaching the manual approval queue while preserving concrete, discussion-led narrative drafts.
## Requirements
### Requirement: Generic AI anti-pattern detection
The system SHALL reject em dashes and a maintained deterministic set of generic contrast-reframing, abstract-observation, promotional-transition, and filler patterns in narrative titles and bodies.

#### Scenario: Generic contrast framing is generated
- **WHEN** a generated draft contains a prohibited contrast-reframing phrase
- **THEN** the reviewer records a naturalness warning with the detected pattern

#### Scenario: Em dash is generated
- **WHEN** a generated draft contains an em dash
- **THEN** the reviewer records a naturalness warning

#### Scenario: Abstract AI smell is generated
- **WHEN** a generated draft uses generic metaphors, adjectives, unexplained mystery, or promotional transitions instead of a concrete observation
- **THEN** the reviewer records a blocking naturalness warning

### Requirement: One bounded naturalness rewrite
The system SHALL request one rewrite through the AI Orchestrator when a live generated draft violates the anti-pattern library or a blocking narrative-quality gate.

#### Scenario: Rewrite resolves a blocker
- **WHEN** the rewritten draft no longer has a detected anti-pattern or quality-gate failure
- **THEN** the system stores the rewritten draft for ordinary manual review

#### Scenario: Rewrite still violates a gate
- **WHEN** the one allowed rewrite still has a detected anti-pattern or quality-gate failure
- **THEN** the system stores it as a draft with a blocking reviewer warning

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

### Requirement: Product injection and unsupported-topic gate
The system SHALL block a reference that is introduced through marketplace language, an abrupt shopping transition, a broken reasoning flow, or an unsupported discussion tangent.

#### Scenario: Reference is carried into a scene
- **WHEN** a draft takes the shortest path from a topic to a product and uses listing-like wording
- **THEN** the reviewer records a bounded Product Injection Score and a blocking explanation

#### Scenario: Reference follows human reasoning
- **WHEN** a draft shows a concrete concern or uncertainty before a contextual reference bridge
- **THEN** the reviewer does not block it for product injection or reasoning flow

#### Scenario: Topic drift appears
- **WHEN** a new discussion domain such as an unexplained community conclusion appears without support from the topic or scene
- **THEN** the reviewer records a blocking topic-drift warning
