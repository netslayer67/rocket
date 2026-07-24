## ADDED Requirements

### Requirement: Bounded reference metadata
The system SHALL extract optional type, site name, author, section, published time, price, currency, and canonical URL metadata from the bounded public HTML preview when available, without persisting the page body.

#### Scenario: Rich product metadata is available
- **WHEN** a public page contains product type, price, currency, site name, and canonical metadata
- **THEN** the transient preview returns those bounded fields and the prompt context can use them

#### Scenario: Article metadata is available
- **WHEN** a public page contains article author, section, and published time metadata
- **THEN** the transient preview returns those fields and preserves the existing title and description

#### Scenario: Metadata is absent
- **WHEN** a public page contains only title or description
- **THEN** the response omits unavailable fields and keeps the existing editable suggestion flow working

#### Scenario: Metadata is unsafe or oversized
- **WHEN** a metadata value is not HTTP(S), exceeds its field cap, or is not present in the bounded response
- **THEN** the value is omitted or truncated and no raw HTML is persisted or logged

### Requirement: Enriched context remains editable
The system SHALL pass available reference metadata through the existing AI Orchestrator for suggestions and narrative generation while preserving alternative angles, evidence labels, and user editability.

#### Scenario: Product reference suggests a broader angle
- **WHEN** a product reference has bounded metadata but the user topic differs
- **THEN** the orchestrator can propose a broader contextual angle without claiming an endorsement or inventing product experience

#### Scenario: Fetch fails
- **WHEN** reference metadata cannot be fetched or validated
- **THEN** the system falls back to the creator-provided title and URL without persisting the failed response
