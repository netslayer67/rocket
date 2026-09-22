## ADDED Requirements

### Requirement: Draft retrieval provenance
The Knowledge Engine SHALL attach a bounded retrieval snapshot to each generated narrative, containing only retrieval mode, semantic and lexical candidate counts, and at most eight knowledge IDs already used for generation. It MUST remain scoped to the active persona and MUST NOT store prompts, raw imported source text, vectors, or full context.

#### Scenario: Draft uses hybrid retrieval
- **WHEN** semantic and lexical active-persona knowledge inform a generated draft
- **THEN** the saved narrative exposes the hybrid mode, bounded counts, and deduplicated knowledge IDs used

#### Scenario: Draft has no knowledge match
- **WHEN** active-persona retrieval has no candidate
- **THEN** the saved narrative exposes an empty retrieval snapshot and generation remains available
