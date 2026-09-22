## ADDED Requirements

### Requirement: Observational evidence quality
The autonomous worker SHALL carry compact quality snapshots from eligible approved active-persona narratives into its existing bounded evidence batch and persist only the aggregate eligible-draft count and average score on its durable cycle. It MUST exclude an explicitly failing snapshot and MUST NOT call a paid model, publish, approve, edit a draft, or claim measured improvement.

#### Scenario: Cycle includes reviewed narrative evidence
- **WHEN** a bounded batch contains eligible approved narratives with quality snapshots
- **THEN** the durable cycle reports its compact quality aggregate and the worker continues its existing free-only synthesis path

#### Scenario: Cycle contains no eligible draft quality
- **WHEN** no approved narrative has a passing snapshot
- **THEN** the worker can still evaluate other approved internal evidence and reports zero eligible drafts without inventing a score
