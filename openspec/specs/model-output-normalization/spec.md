# Model Output Normalization

## Purpose

Tolerate harmless presentation formatting around structured model responses while retaining strict domain validation and privacy.

## Requirements

### Requirement: Bounded structured model-output normalization
Before a structured narrative or reference-angle response is parsed, the system SHALL accept exactly one valid JSON object from either a trimmed response, a JSON Markdown fence, or a harmless surrounding presentation wrapper. It MUST retain each destination parser's required fields, grounding checks, quality gate, bounded fallback, and telemetry privacy. It MUST reject malformed, absent, or incomplete structured output.

#### Scenario: Model wraps a complete narrative object
- **WHEN** a persona model returns a short presentation sentence followed by one complete narrative JSON object
- **THEN** the narrative parser evaluates that object through the existing shape and quality gates

#### Scenario: Model returns malformed JSON
- **WHEN** no valid JSON object can be extracted from the model response
- **THEN** the output gate returns `invalid-output` and no raw response is persisted or logged
