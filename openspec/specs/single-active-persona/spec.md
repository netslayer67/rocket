# Single Active Persona

## Purpose

Keep one evolving narrator coherent by scoping new generation, DNA, and review signals to its active profile.

## Requirements

### Requirement: Canonical persona lifecycle
The system SHALL maintain exactly one active persona for new work, with core identity, thinking style, claim boundaries, and current interests stored separately. Archived personas and their historical narratives SHALL remain readable but SHALL not be eligible for new generation or learning evidence.

#### Scenario: Legacy personas are adopted
- **WHEN** a workspace has legacy personas but none marked active
- **THEN** the most recent persona becomes active and the remaining personas are archived without deleting historic narratives

#### Scenario: Active profile is updated
- **WHEN** the creator saves the active profile
- **THEN** its fields are updated in place and no additional active persona is created

### Requirement: Persona-scoped learning and retrieval
The system SHALL link every newly created usable knowledge lesson to the active persona and SHALL retrieve and autonomously consolidate only records belonging to that active persona. Legacy knowledge without a persona link SHALL be retained but excluded from active generation and learning.

#### Scenario: Feedback becomes DNA
- **WHEN** approved feedback for an active-persona narrative becomes a lesson
- **THEN** the saved lesson uses that same persona ID

#### Scenario: Archived or legacy material exists
- **WHEN** a record belongs to an archived persona or has no persona ID
- **THEN** it does not enter new active-persona retrieval or autonomous evidence

### Requirement: Rolling quality signals
The system SHALL expose a read-only rolling 30-day summary for the active persona using persisted narrative reviewer diagnostics. It SHALL report draft count and blocker counts for persona consistency, specificity/human thinking, generic-AI language, and product injection without claiming a quality score or replacing manual approval.

#### Scenario: Active persona has reviewed drafts
- **WHEN** the creator opens the studio with active-persona drafts in the rolling window
- **THEN** the profile displays the diagnostic-based quality signals in plain language

#### Scenario: No active drafts exist
- **WHEN** the active persona has no drafts in the rolling window
- **THEN** the summary reports no review signals yet and does not imply failure
