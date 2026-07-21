## ADDED Requirements

### Requirement: Transient reference metadata preview
The system SHALL accept a creator-provided public HTTP(S) reference URL, follow a bounded number of validated public redirects, and extract only its public HTML title and description without persisting page content.

#### Scenario: Public page contains metadata
- **WHEN** a creator requests a suggestion for a public HTML reference URL with title metadata
- **THEN** the system returns a concise reference title and retains no fetched page body

#### Scenario: Unsafe or unsupported URL is provided
- **WHEN** a reference URL resolves to a private host, returns unsupported content, exceeds the read limit, or cannot be read
- **THEN** the system rejects the suggestion request without persisting the response

### Requirement: Contextual topic suggestion
The system SHALL generate one editable Indonesian topic suggestion through the AI Orchestrator using only the transient reference metadata.

#### Scenario: Reference is a product page
- **WHEN** metadata describes a product, book, or other reference
- **THEN** the topic may frame a broader related observation or phenomenon rather than restating the reference category

#### Scenario: Unsupported connection would be required
- **WHEN** a suggested angle would require an unverified claim about a person, product, or endorsement
- **THEN** the system avoids that claim and returns a neutral, editable angle
