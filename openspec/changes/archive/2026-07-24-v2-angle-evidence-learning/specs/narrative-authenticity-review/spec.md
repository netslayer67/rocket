## MODIFIED Requirements

### Requirement: Reference enters through human reasoning
The reviewer SHALL detect a reference that is introduced through an abrupt marketplace transition instead of an observable concern or thought process. Persona vocabulary SHALL be evaluated with its surrounding scene, thinking style, and reasoning, never as a standalone forbidden-word list. Product details SHALL be evaluated against available evidence provenance, including the selected angle's metadata-only labels, not a firsthand-only rule. Feedback dimensions SHALL be available for later diagnosis but SHALL NOT make one reasoning sequence mandatory.

#### Scenario: Product is injected
- **WHEN** a draft uses marketplace language or a shopping transition to introduce its reference without a prior human concern
- **THEN** the reviewer records a blocking Product Injection Score and explains that the story is carrying the product

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
