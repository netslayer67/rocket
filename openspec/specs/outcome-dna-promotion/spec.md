# Outcome DNA Promotion

## Purpose

Turn a reviewed manual outcome signal into reusable diagnosis-first DNA only after explicit operator approval.

## Requirements

### Requirement: Explicit outcome promotion
The system SHALL allow an operator to promote a manual analytics candidate into one diagnosis-first Knowledge DNA lesson only when the request explicitly contains `approved: true` and a positive or negative lesson type.

#### Scenario: Approved promotion
- **WHEN** an operator approves a candidate with `approved: true` and a lesson type
- **THEN** one lesson is created through KnowledgeService, linked to the narrative, indexed by the existing vector path, and returned as promoted

#### Scenario: Missing approval or candidate
- **WHEN** approval is false/missing or no manual candidate exists
- **THEN** the API rejects the request without creating a lesson

#### Scenario: Repeated promotion
- **WHEN** an already promoted narrative is submitted again
- **THEN** the existing lesson id is returned and no duplicate is created

### Requirement: Diagnosis and provenance are preserved
The promoted lesson SHALL record lesson type, manual sample context, non-causal diagnosis, root cause, recommended fix, failure dimensions when negative, and evidence source `manual-analytics`.

#### Scenario: Negative lesson
- **WHEN** a negative candidate is approved
- **THEN** the lesson includes a bounded diagnosis and fix rather than a vocabulary blacklist or universal rule
