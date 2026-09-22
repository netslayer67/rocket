## MODIFIED Requirements

### Requirement: Shared pre-acceptance quality gate
The system SHALL reject a live persona-model narrative response from model routing when required JSON cannot be parsed into title, body, and link placement. A parseable response SHALL enter the existing deterministic review, one bounded rewrite attempt, quality snapshot, and manual-approval flow even when it has blocking diagnostics. Blocking diagnostics MUST remain visible and MUST block approval and publishing; raw rejected outputs MUST NOT be persisted.

#### Scenario: Model returns malformed output
- **WHEN** a live response cannot be parsed into the required narrative shape
- **THEN** the orchestrator rejects that model response without persisting its content and may try the next bounded free candidate

#### Scenario: Model returns a generic or selling draft
- **WHEN** a live response parses into the required shape but triggers a blocking generic-AI, persona, stereotype, evidence, or product-injection diagnostic
- **THEN** it enters the existing bounded rewrite and manual-review flow, and it remains blocked from approval or publishing unless the final deterministic review clears it

#### Scenario: Model returns a valid natural draft
- **WHEN** a live response parses into the required narrative shape and has no blocking deterministic diagnostic
- **THEN** the model response is accepted for the existing save and manual-review flow
