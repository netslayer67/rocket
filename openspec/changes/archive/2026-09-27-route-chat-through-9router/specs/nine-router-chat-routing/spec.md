## ADDED Requirements

### Requirement: Configured 9Router interactive chat route
When an operator supplies both `NINE_ROUTER_BASE_URL` and `NINE_ROUTER_API_KEY`, the system SHALL send interactive persona chat completions to that OpenAI-compatible base URL. It MUST use the configured `NINE_ROUTER_PERSONA_MODELS` in bounded order, send `stream: false`, preserve the active-persona contract and output gate, and omit OpenRouter-specific provider routing. It MUST NOT log credentials, provider bodies, prompts, or outputs.

#### Scenario: Direct 9Router persona model succeeds
- **WHEN** the configured first 9Router persona model returns a valid JSON-shaped narrative response
- **THEN** the system accepts it through the existing output gate and records only compact model telemetry

#### Scenario: 9Router returns an SSE response by default
- **WHEN** the 9Router endpoint would stream a completion unless requested otherwise
- **THEN** the system sends `stream: false` and parses one JSON completion body

### Requirement: Safe 9Router configuration boundary
The system SHALL require both 9Router endpoint and key before activating the 9Router chat route. It MUST reject a partial 9Router configuration without silently sending the request to OpenRouter, and it MUST retain the existing OpenRouter route when neither 9Router value is configured.

#### Scenario: Endpoint lacks a key
- **WHEN** `NINE_ROUTER_BASE_URL` is set but `NINE_ROUTER_API_KEY` is absent
- **THEN** an interactive request returns a safe configuration error and sends no provider request

### Requirement: Embedding and autonomous-learning isolation
The system SHALL keep embeddings and free-only autonomous learning on their existing OpenRouter configuration during the 9Router interactive-chat migration. It MUST NOT use 9Router's subscription or cheap fallback for autonomous learning.

#### Scenario: Interactive 9Router and semantic retrieval are both enabled
- **WHEN** a narrative needs semantic retrieval while 9Router chat is configured
- **THEN** the existing OpenRouter embedding route queries Qdrant and the interactive completion uses 9Router
