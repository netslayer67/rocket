# Review Diagnostics

## Purpose

Expose stable, diagnosis-first reviewer output without replacing human-readable notes or policing vocabulary.

## Requirements

### Requirement: Structured reviewer diagnostics
The system SHALL expose stable diagnostic codes, dimensions, severity, and human-readable messages derived from reviewer notes, while preserving the original notes and avoiding standalone vocabulary or mandatory-flow rules.

#### Scenario: Blocking note is recognized
- **WHEN** a narrative has a Product Injection, Topic drift, Context drift, or Diagnosis evidence note
- **THEN** the response includes a blocking diagnostic with a stable code and matching dimension

#### Scenario: Unknown note is retained
- **WHEN** a reviewer note has no known diagnostic mapping
- **THEN** the response retains the note and emits an `OTHER_REVIEW_NOTE` diagnostic instead of dropping it

#### Scenario: Clean review has no diagnostics
- **WHEN** a narrative has no reviewer notes
- **THEN** the response returns an empty diagnostic list
