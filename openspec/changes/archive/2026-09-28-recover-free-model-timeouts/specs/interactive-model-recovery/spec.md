## ADDED Requirements

### Requirement: Bounded interactive persona request window
The API SHALL allow each configured interactive persona-model request up to 75 seconds before aborting it. It MUST retain the 30-second timeout for embeddings and free-only internal learning, and it MUST NOT retry an aborted candidate beyond the configured fallback list.

#### Scenario: Interactive free model responds after the old timeout
- **WHEN** a configured persona model responds after 30 seconds but before 75 seconds
- **THEN** the API accepts and processes that response through its normal output gate

#### Scenario: Interactive free model exceeds the bounded window
- **WHEN** a configured persona model does not respond within 75 seconds
- **THEN** the API records a safe `timeout` rejection and tries only the next configured candidate

### Requirement: Safe failed-route summary
When every configured interactive persona model fails, the API SHALL return an unavailable-model error with the ordered distinct safe rejection codes observed for that run. It MUST NOT return provider bodies, prompts, source text, drafts, credentials, URLs, or error stacks.

#### Scenario: Different configured routes fail for different reasons
- **WHEN** one persona candidate times out and the next candidate receives HTTP 429
- **THEN** the final unavailable-model error identifies both `timeout` and `http-429` in attempted order
