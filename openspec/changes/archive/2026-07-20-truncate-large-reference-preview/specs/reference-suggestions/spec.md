## MODIFIED Requirements

### Requirement: Transient reference metadata preview
The system SHALL accept a creator-provided public HTTP(S) reference URL, follow a bounded number of validated public redirects, and extract only its public HTML title and description from a bounded page prefix without persisting page content.

#### Scenario: Public page contains metadata
- **WHEN** a creator requests a suggestion for a public HTML reference URL with title metadata
- **THEN** the system returns a concise reference title and retains no fetched page body

#### Scenario: Public page exceeds the preview cap
- **WHEN** a valid public HTML response is larger than the bounded preview limit
- **THEN** the system reads no more than that limit, extracts available metadata from the prefix, and returns an editable suggestion

#### Scenario: Unsafe or unsupported URL is provided
- **WHEN** a reference URL resolves to a private host, returns unsupported content, or cannot be read
- **THEN** the system rejects the suggestion request without persisting the response
