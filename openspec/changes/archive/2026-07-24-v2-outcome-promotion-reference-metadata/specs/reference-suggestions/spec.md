## MODIFIED Requirements

### Requirement: Transient reference metadata preview
The system SHALL accept a creator-provided public HTTP(S) reference URL, follow a bounded number of validated public redirects, and extract only bounded public HTML metadata including title, description, and optional type, site name, author, section, published time, price, currency, and canonical URL without persisting page content.

#### Scenario: Public page contains metadata
- **WHEN** a creator requests a suggestion for a public HTML reference URL with title or richer metadata
- **THEN** the system returns concise bounded metadata for context and retains no fetched page body

#### Scenario: Public page exceeds the preview cap
- **WHEN** a valid public HTML response is larger than the bounded preview limit
- **THEN** the system reads no more than that limit, extracts available metadata from the prefix, and returns an editable suggestion

#### Scenario: Unsafe or unsupported URL is provided
- **WHEN** a reference URL resolves to a private host, returns unsupported content, or cannot be read
- **THEN** the system rejects or falls back without persisting the response

### Requirement: Contextual topic suggestion
The system SHALL generate an editable Indonesian recommended angle plus up to two alternative angles through the AI Orchestrator using only transient reference metadata. Each angle SHALL include bounded confidence, a reason, and evidence provenance; the topic may differ from the reference category when its bridge is explicit and unverified claims are avoided.

#### Scenario: Reference is a product page
- **WHEN** metadata describes a product, book, or other reference
- **THEN** the response returns multiple editable directions that may frame a broader related observation rather than restating the reference category

#### Scenario: Unsupported connection would be required
- **WHEN** a suggested angle would require an unverified claim about a person, product, or endorsement
- **THEN** the system avoids that claim, marks metadata-only evidence, and returns a neutral editable angle

#### Scenario: Existing single-topic client
- **WHEN** a client reads only the legacy `topic` field
- **THEN** the recommended angle title remains available as `topic` so the client continues to work
