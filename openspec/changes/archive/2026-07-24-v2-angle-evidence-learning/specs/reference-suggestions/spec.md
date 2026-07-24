## MODIFIED Requirements

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
