## ADDED Requirements

### Requirement: Diagnosis-based narrative guardrails
Meaningful changes to narrative learning or reviewer logic SHALL record the diagnosis, root cause, remediation, and overfitting ceiling in OpenSpec. Guardrails MUST evaluate context and outcomes before adding lexical restrictions.

#### Scenario: Reviewer rule is changed
- **WHEN** a change adds or modifies a narrative guard
- **THEN** its OpenSpec artifacts include a positive case, a negative case, the failure dimension, and the reason a simpler context check is insufficient

#### Scenario: Ponytail ceiling is known
- **WHEN** a narrow heuristic is retained as the smallest safe implementation
- **THEN** the code or project context documents its known ceiling and the reviewed-example threshold for broadening it

#### Scenario: Narrative diversity is preserved
- **WHEN** a prompt or DNA lesson presents a preferred reasoning flow
- **THEN** it is described as optional guidance and the reviewer does not require one fixed sequence for approval
