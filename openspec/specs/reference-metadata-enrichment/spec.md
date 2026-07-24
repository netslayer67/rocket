# Reference Metadata Enrichment

## Purpose

Provide richer but bounded context for narrative angle selection without storing fetched page content.

## Requirements

### Requirement: Bounded transient metadata
The system SHALL expose optional type, site name, author, section, published time, price, currency, and canonical URL metadata when present in a bounded public HTML preview, omitting absent values and retaining no page body.

#### Scenario: Rich metadata is available
- **WHEN** a public reference contains product or article metadata
- **THEN** the transient preview and existing orchestrator prompts can use the bounded fields

#### Scenario: Metadata is absent or unsafe
- **WHEN** fields are absent, oversized, malformed, or non-HTTP(S)
- **THEN** they are omitted or capped and no raw response is persisted or logged

### Requirement: Existing suggestion flow remains compatible
The system SHALL preserve editable recommended and alternative angles and fall back to creator-provided title and URL if preview fetching fails.

#### Scenario: Enriched product context differs from topic
- **WHEN** metadata describes a product but the creator topic is broader
- **THEN** suggestions may use a truthful contextual bridge without inventing endorsement or firsthand experience
