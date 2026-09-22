# Draft Quality Evaluation

## Purpose

Define deterministic, reviewable draft-quality metadata without treating it as a content-performance prediction or model training signal.

## Requirements

### Requirement: Deterministic draft-quality snapshot
The system SHALL evaluate every generated narrative against persona consistency, specificity, stereotype risk, and hidden-selling risk using current deterministic reviewer diagnostics. It SHALL persist a compact score per dimension, an overall score, pass/fail state, and stable diagnostic codes; it MUST NOT call a model solely to score a draft or claim that the score predicts performance.

#### Scenario: Draft passes the gate
- **WHEN** a generated draft has no blocking diagnostics in the four quality dimensions
- **THEN** its saved quality snapshot records passing scores and remains eligible for manual review

#### Scenario: Draft has a quality failure
- **WHEN** a reviewer detects an unearned persona claim, missing specific thought process, explicit group stereotype, or product-led selling transition
- **THEN** the saved quality snapshot identifies the affected dimension and the existing approval block remains in effect

### Requirement: Bounded learning quality aggregate
The system SHALL include only compact snapshots from eligible approved active-persona narratives in autonomous-learning evidence and SHALL record an aggregate eligible-draft count and average score on the learning cycle. It MUST treat this aggregate as observational and must not infer causation or modify a narrative.

#### Scenario: Eligible approved narratives are consolidated
- **WHEN** autonomous learning collects approved narratives with passing quality snapshots
- **THEN** the cycle stores only the aggregate count and average score alongside its existing evidence IDs

#### Scenario: Explicitly failed draft is present
- **WHEN** an approved legacy or inconsistent record has an explicit failing quality snapshot
- **THEN** it is excluded from autonomous-learning narrative evidence
