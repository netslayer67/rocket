## ADDED Requirements

### Requirement: Sequence-level commercial context
The reviewer SHALL evaluate each sequence link as a contextual reference rather than a default sales CTA, and SHALL keep blocking diagnostics visible before approval.

#### Scenario: Link answers an established reader need
- **WHEN** a supplied URL follows an anchor that identifies an object, item, recommendation, or answer in the same segment
- **THEN** the reviewer does not block the draft solely because the URL is not at the end

#### Scenario: Sequence pressures a reader to buy
- **WHEN** a sequence uses detached links, urgency, or unverified scarcity as its commercial mechanism
- **THEN** the reviewer records a blocking diagnostic and keeps approval unavailable
