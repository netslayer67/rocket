## ADDED Requirements

### Requirement: Semantic-read Qdrant activity
The workflow map SHALL activate Qdrant only when a recent persisted event confirms that a semantic read completed. It SHALL keep Qdrant muted for lexical/recent fallback and failed semantic retrieval.

#### Scenario: Semantic query completes without matches
- **WHEN** a draft's semantic query completes but returns no knowledge match
- **THEN** the Qdrant node is active because a real semantic read occurred

#### Scenario: Semantic query is unavailable
- **WHEN** a draft falls back after a failed semantic query
- **THEN** the Qdrant node remains muted
