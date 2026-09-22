## MODIFIED Requirements

### Requirement: Approved internal evidence only
The system SHALL autonomously consolidate at most six recent approved feedback items, six non-autonomous DNA records, and six approved narratives per batch for the active persona. It MUST exclude drafts, unapproved feedback, archived-persona records, unscoped legacy DNA, and its own autonomous outputs, and revalidate source eligibility before saving. Imported source bodies MUST NOT be persisted or logged.

#### Scenario: Eligible active-persona inputs
- **WHEN** approved active-persona evidence exists
- **THEN** the worker can process it without browser traffic or a button press

#### Scenario: Archived, unapproved, or self-generated inputs
- **WHEN** inputs belong to an archived persona, are unscoped legacy DNA, drafts, unapproved feedback, or autonomous DNA
- **THEN** they cannot become learning evidence
