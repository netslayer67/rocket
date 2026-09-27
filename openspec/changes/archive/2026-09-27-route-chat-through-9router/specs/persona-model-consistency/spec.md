## MODIFIED Requirements

### Requirement: Bounded free persona fallback
The system SHALL select at most four named `:free` persona models from the operator's OpenRouter configuration, exclude the dynamic `openrouter/free` router, and use the next model only after a provider or required-output-shape rejection. When both `NINE_ROUTER_BASE_URL` and `NINE_ROUTER_API_KEY` are configured, it SHALL instead select at most four explicit `NINE_ROUTER_PERSONA_MODELS` in operator order. Persona-model requests SHALL rely on the versioned voice-contract prompt and shared output gate for JSON validation and MUST NOT require an OpenRouter `response_format` option that a named provider may not support. It MUST NOT use a paid fallback, modify the autonomous-learning allowlist, or make an unbounded number of model calls.

#### Scenario: First model has malformed required output
- **WHEN** a live narrative response cannot be parsed into title, body, and link placement
- **THEN** the response is rejected without persisting its content and the next configured named free model is attempted

#### Scenario: Candidate list includes an invalid OpenRouter route
- **WHEN** the configured OpenRouter persona list contains `openrouter/free` or a non-free model
- **THEN** that candidate is skipped and no request is sent to it

#### Scenario: A configured 9Router model fails
- **WHEN** a configured 9Router persona model returns a safe routing or output-shape rejection
- **THEN** the next explicit 9Router persona model is attempted with the same voice contract and shared output gate

#### Scenario: A parseable model response needs review
- **WHEN** a configured named free model returns the required narrative shape with deterministic reviewer failures
- **THEN** that response enters the bounded rewrite and manual-review flow without attempting later candidates solely to bypass reviewer diagnostics

#### Scenario: A named free model does not support strict provider JSON
- **WHEN** the active persona request targets a configured named free model that rejects OpenRouter `response_format`
- **THEN** the request omits that provider option, validates the prompt-constrained response through the shared gate, and retains the existing bounded fallback behavior
