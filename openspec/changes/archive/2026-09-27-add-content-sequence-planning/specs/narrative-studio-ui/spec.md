## ADDED Requirements

### Requirement: Sequence-first draft review
The dashboard SHALL show a generated main post, ordered replies, contextual-link intent, and any media brief in the existing review workflow. It SHALL remain readable, keyboard accessible, and free of horizontal overflow on narrow viewports.

#### Scenario: Creator reviews a sequence
- **WHEN** a saved draft includes a content sequence
- **THEN** the review card labels each post's objective, link context, and creator-supplied media brief before approval

#### Scenario: Creator sees V1 publish scope
- **WHEN** an approved sequence is eligible for the existing Threads publisher
- **THEN** the dashboard states that only the main post is sent and replies/media remain manual
