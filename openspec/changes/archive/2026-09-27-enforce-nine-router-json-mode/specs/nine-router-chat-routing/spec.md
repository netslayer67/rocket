## MODIFIED Requirements

### Requirement: Configured 9Router interactive chat route
When an operator supplies both `NINE_ROUTER_BASE_URL` and `NINE_ROUTER_API_KEY`, the system SHALL send interactive persona chat completions to that OpenAI-compatible base URL. It MUST use the configured `NINE_ROUTER_PERSONA_MODELS` in bounded order, send `stream: false`, and when the caller requires structured output send OpenAI-compatible JSON-object response formatting. It MUST preserve the active-persona contract and output gate, omit OpenRouter-specific provider routing, and MUST NOT log credentials, provider bodies, prompts, or outputs.

#### Scenario: Direct 9Router persona model succeeds
- **WHEN** the configured first 9Router persona model returns a valid JSON-shaped narrative response
- **THEN** the system accepts it through the existing output gate and records only compact model telemetry

#### Scenario: 9Router returns an SSE response by default
- **WHEN** the 9Router endpoint would stream a completion unless requested otherwise
- **THEN** the system sends `stream: false` and parses one JSON completion body

#### Scenario: Structured persona output is requested
- **WHEN** an interactive 9Router request requires a JSON-shaped narrative or reference suggestion
- **THEN** the request includes JSON-object response formatting before the existing output gate evaluates the result
