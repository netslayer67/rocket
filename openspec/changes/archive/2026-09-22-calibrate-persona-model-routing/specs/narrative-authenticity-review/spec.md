## ADDED Requirements

### Requirement: Shared pre-acceptance quality gate
The system SHALL apply the existing deterministic review diagnostics and quality snapshot before accepting a live persona-model narrative response. A response with blocking diagnostics or invalid required JSON MUST be rejected from model routing without persisting its content; a later configured free model can be tried within the existing bounded route.

#### Scenario: Model returns a generic or selling draft
- **WHEN** a live response triggers a blocking generic-AI, persona, stereotype, evidence, or product-injection diagnostic
- **THEN** the orchestrator rejects that model response before it becomes a draft and may try the next bounded free candidate

#### Scenario: Model returns a valid natural draft
- **WHEN** a live response parses into the required narrative shape and has no blocking deterministic diagnostic
- **THEN** the model response is accepted for the existing save and manual-review flow
