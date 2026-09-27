## ADDED Requirements

### Requirement: Safe configured-model attempt diagnostics
For every failed configured model candidate, the API SHALL persist a compact model ID, task, accepted=false, and a safe routing outcome code before trying the next configured candidate. It MUST NOT persist or return provider response bodies, prompts, sources, drafts, credentials, request URLs, or error stacks.

#### Scenario: Candidate returns HTTP 404
- **WHEN** a configured persona model returns HTTP 404
- **THEN** its compact model run records `http-404`, the next candidate is attempted, and monitoring can show the failed candidate

#### Scenario: All candidates fail
- **WHEN** every configured persona model fails
- **THEN** the job returns a safe unavailable-model error and monitoring retains each compact candidate outcome

### Requirement: Semantic retrieval result metadata
Generation retrieval metadata SHALL distinguish a completed semantic query from an unavailable semantic path while retaining lexical and recent fallback behavior.

#### Scenario: Qdrant query returns no match
- **WHEN** a Qdrant semantic query completes with no matching knowledge IDs
- **THEN** metadata records that semantic retrieval was queried and generation may use lexical or recent fallback

#### Scenario: Qdrant query fails
- **WHEN** semantic retrieval fails
- **THEN** metadata records that no semantic query completed and generation continues with the existing fallback without writing Qdrant
