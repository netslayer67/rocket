## ADDED Requirements

### Requirement: Persona-model gate visibility
The monitoring history and live stream SHALL expose compact accepted or rejected status for persona-model attempts, including an optional bounded gate code. It MUST preserve the existing prohibition on prompts, source text, generated content, credentials, and provider error bodies.

#### Scenario: Fallback is used
- **WHEN** a persona-model response is rejected and a later candidate is attempted
- **THEN** monitoring shows each compact outcome so the operator can distinguish a successful fallback from fabricated model activity
