## ADDED Requirements

### Requirement: Honest angle origin
The reference suggestion response SHALL identify whether its angles came from a valid model response or from a metadata-only fallback. It MUST NOT persist the origin, raw page body, model failure body, prompt, or creator content.

#### Scenario: Model returns usable angles
- **WHEN** a configured model returns grounded unique angles
- **THEN** the response origin is `model`

#### Scenario: Model is unavailable or invalid
- **WHEN** no configured model produces a usable angle
- **THEN** the response origin is `metadata-fallback` and its confidence remains low
