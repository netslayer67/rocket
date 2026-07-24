## MODIFIED Requirements

### Requirement: Semantic retrieval with fallback
The system SHALL combine bounded semantic matches with bounded lexical topic matches for generation context. Semantic order SHALL be preserved first, lexical additions SHALL follow in deterministic `createdAt` order, and duplicate Mongo IDs SHALL be removed. If semantic search fails, lexical or recent knowledge patterns SHALL still be used.

#### Scenario: Semantic and lexical matches overlap
- **WHEN** a narrative is generated for a topic that has both Qdrant matches and lexical topic matches
- **THEN** the context contains each matching knowledge record once, with semantic matches first and lexical-only matches appended

#### Scenario: Semantic search fails
- **WHEN** a vector query cannot be performed
- **THEN** narrative generation continues with lexical or recent knowledge patterns and records a lexical-fallback retrieval mode

#### Scenario: No candidate exists
- **WHEN** semantic and lexical retrieval return no records
- **THEN** generation continues without knowledge context and records an empty retrieval mode

### Requirement: Retrieval observability
The system SHALL record compact retrieval metadata for narrative AI runs, including retrieval mode, semantic and lexical candidate counts, and bounded matched knowledge IDs. It MUST NOT persist prompts, raw imported source text, vectors, credentials, or full generated context in this metadata.

#### Scenario: Hybrid retrieval succeeds
- **WHEN** narrative generation uses semantic and lexical candidates
- **THEN** the AI run records the mode, candidate counts, and deduplicated knowledge IDs

#### Scenario: Retrieval provider is unavailable
- **WHEN** Qdrant or the embedding provider fails
- **THEN** the AI run records the fallback mode and generation remains available through the existing orchestrator path

### Requirement: Diagnosis-first lesson metadata remains flexible
The system SHALL use positive and negative lesson diagnosis, root cause, recommended fix, failure dimensions, and evidence-source labels as guidance or constraints. It MUST NOT treat a persona vocabulary word as a standalone forbidden pattern and MUST NOT require one fixed reasoning sequence for every narrative.

#### Scenario: Vocabulary appears in valid context
- **WHEN** a retrieved lesson contains a persona vocabulary term that is supported by the current scene or experience
- **THEN** the term remains eligible and the reviewer does not reject it solely because of the word

#### Scenario: Negative diagnosis is relevant
- **WHEN** a retrieved negative lesson matches the current narrative failure dimension
- **THEN** generation and review use its diagnosis and recommended fix without copying source text or forcing a fixed structure

### Requirement: Knowledge library and reindexing
The system SHALL expose stored patterns and their vector status and SHALL allow a user to reindex existing knowledge without resubmitting raw sources. The UI SHALL explain that reindexing refreshes the derived Qdrant search index.

#### Scenario: Existing V1 knowledge needs vectors
- **WHEN** a user starts reindexing
- **THEN** the system processes stored pattern metadata and returns indexed and pending counts

#### Scenario: User reads the library help
- **WHEN** a user views the Knowledge Library
- **THEN** the page explains in concise language that reindexing makes stored patterns searchable and does not change the original DNA
