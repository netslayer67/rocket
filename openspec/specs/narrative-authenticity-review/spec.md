# Narrative Authenticity Review

## Purpose

Keep references inside a believable human thought process instead of using a narrative as a wrapper for product copy.

## Requirements

### Requirement: Reference enters through human reasoning
The reviewer SHALL detect a reference that is introduced through an abrupt marketplace transition instead of an observable concern or thought process. It SHALL also reject persona vocabulary used as a substitute for earned experience and product details stated without an observable or trusted basis.

#### Scenario: Product is injected
- **WHEN** a draft uses marketplace language or a shopping transition to introduce its reference without a prior human concern
- **THEN** the reviewer records a blocking Product Injection Score and explains that the story is carrying the product

#### Scenario: Reference follows an observation
- **WHEN** a draft shows a concrete personal observation and uncertainty before a contextual reference bridge
- **THEN** the reviewer does not block it for product injection

#### Scenario: Persona vocabulary is forced
- **WHEN** a draft inserts community, creative, culture, or fashion-context language without an earned scene or experience
- **THEN** the reviewer records a blocking persona-cosplay warning

#### Scenario: Product detail lacks evidence
- **WHEN** a draft claims garment construction, silhouette, drape, or texture behavior without firsthand evidence
- **THEN** the reviewer records a blocking evidence-consistency warning

### Requirement: Topic branches stay supported
The reviewer SHALL flag a new discussion domain when it appears without being present in the supplied topic or a clear bridge.

#### Scenario: Unsupported tangent
- **WHEN** a beach-wedding narrative introduces a generic warm-community conclusion without building that topic
- **THEN** the reviewer records a blocking topic-drift note

#### Scenario: Built topic branch
- **WHEN** the topic or preceding narrative explicitly establishes the discussion domain
- **THEN** the reviewer leaves the topic-drift check clear
