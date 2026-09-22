# Narrative Authenticity Review

## Purpose

Keep references inside a believable human thought process instead of using a narrative as a wrapper for product copy.

## Requirements

### Requirement: Reference enters through human reasoning
The reviewer SHALL detect a reference that is introduced through an abrupt marketplace transition instead of an observable concern or thought process. Persona vocabulary SHALL be evaluated with its surrounding scene, thinking style, and reasoning, never as a standalone forbidden-word list. Product details SHALL be evaluated against available evidence provenance, including the selected angle's metadata-only labels, not a firsthand-only rule. Feedback dimensions SHALL be available for later diagnosis through stable diagnostic codes but SHALL NOT make one reasoning sequence mandatory.

#### Scenario: Product is injected
- **WHEN** a draft uses marketplace language or a shopping transition to introduce its reference without a prior human concern
- **THEN** the reviewer records a blocking Product Injection Score, exposes a reference-dimension diagnostic, and explains that the story is carrying the product

#### Scenario: Reference follows an observation
- **WHEN** a draft shows a concrete personal observation and uncertainty before a contextual reference bridge
- **THEN** the reviewer does not block it for product injection

#### Scenario: Persona vocabulary has no earned context
- **WHEN** a first-person draft uses persona-style vocabulary without a concrete observation, scene, thinking style, or reasoning cue that supports the term
- **THEN** the reviewer records a blocking persona-diagnosis warning

#### Scenario: Ordinary vocabulary has earned context
- **WHEN** a draft uses a term such as community, culture, or creative work inside a supported scene or reasoning process
- **THEN** the reviewer does not block the draft because of that term alone

#### Scenario: Product detail has evidence
- **WHEN** a draft states a product detail from firsthand, user-confirmed, or trusted reference metadata and labels an inference as uncertain when needed
- **THEN** the reviewer does not block the detail for unsupported evidence

#### Scenario: Product detail lacks evidence
- **WHEN** a draft states a product detail without firsthand, user-confirmed, or trusted metadata evidence
- **THEN** the reviewer records a blocking evidence-consistency warning

### Requirement: Topic branches stay supported
The reviewer SHALL flag a new discussion domain when it appears without being present in the supplied topic or a clear bridge.

#### Scenario: Unsupported tangent
- **WHEN** a beach-wedding narrative introduces a generic warm-community conclusion without building that topic
- **THEN** the reviewer records a blocking topic-drift note

#### Scenario: Built topic branch
- **WHEN** the topic or preceding narrative explicitly establishes the discussion domain
- **THEN** the reviewer leaves the topic-drift check clear

### Requirement: Explicit stereotype risk detection
The reviewer SHALL flag an explicit universal generalization that reduces a demographic or place-based identity to a trait, while allowing concrete, qualified observations about an individual or context. The check MUST be contextual, narrowly scoped, and must not become a persona-vocabulary blacklist.

#### Scenario: Draft makes a universal identity claim
- **WHEN** a draft claims that all women, all girls, or all people from a named place share a behaviour or preference
- **THEN** the reviewer records a blocking stereotype-risk diagnostic and the quality snapshot reduces its stereotype dimension

#### Scenario: Draft makes a qualified observation
- **WHEN** a draft describes one person's stated preference or a bounded local observation without assigning it to an entire group
- **THEN** the reviewer does not flag stereotype risk solely because an identity or location is mentioned

### Requirement: Shared pre-acceptance quality gate
The system SHALL reject a live persona-model narrative response from model routing when required JSON cannot be parsed into title, body, and link placement. A parseable response SHALL enter the existing deterministic review, one bounded rewrite attempt, quality snapshot, and manual-approval flow even when it has blocking diagnostics. Blocking diagnostics MUST remain visible and MUST block approval and publishing; raw rejected outputs MUST NOT be persisted.

#### Scenario: Model returns malformed output
- **WHEN** a live response cannot be parsed into the required narrative shape
- **THEN** the orchestrator rejects that model response without persisting its content and may try the next bounded free candidate

#### Scenario: Model returns a generic or selling draft
- **WHEN** a live response parses into the required shape but triggers a blocking generic-AI, persona, stereotype, evidence, or product-injection diagnostic
- **THEN** it enters the existing bounded rewrite and manual-review flow, and it remains blocked from approval or publishing unless the final deterministic review clears it

#### Scenario: Model returns a valid natural draft
- **WHEN** a live response parses into the required narrative shape and has no blocking deterministic diagnostic
- **THEN** the model response is accepted for the existing save and manual-review flow
