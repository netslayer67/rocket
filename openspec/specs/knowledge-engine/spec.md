# Knowledge Engine

## Purpose

Define how Rocket Project extracts, indexes, retrieves, and exposes reusable narrative patterns without retaining imported source text.
## Requirements
### Requirement: Rich pattern extraction
The system SHALL extract reusable narrative metadata including conflict, information gap, discussion pattern, authority type, CTA style, naturalness score, and the existing hook, emotion, narrative type, curiosity, and link placement fields.

#### Scenario: Source is imported
- **WHEN** a creator submits source content for knowledge import
- **THEN** the system stores only compact extracted metadata and does not persist the raw source content

### Requirement: Semantic knowledge index
The system SHALL create an embedding for a compact pattern document through the AI Orchestrator and SHALL upsert it into Qdrant using cosine similarity.

#### Scenario: Vector infrastructure is available
- **WHEN** a pattern is extracted and Qdrant plus the embedding model are available
- **THEN** the knowledge record is marked ready and its Mongo ID is stored as Qdrant point payload

#### Scenario: Vector infrastructure is unavailable
- **WHEN** indexing cannot reach Qdrant or the embedding model
- **THEN** the metadata import succeeds, the record is marked pending, and no raw source content is retained

### Requirement: Semantic retrieval with fallback
The system SHALL use semantic matches as generation context and SHALL fall back to lexical topic matching if semantic retrieval has no result.

#### Scenario: Semantic match exists
- **WHEN** a narrative is generated for a related topic
- **THEN** the highest-ranked Qdrant matches are retrieved from MongoDB and used before lexical matches

#### Scenario: Semantic search fails
- **WHEN** a vector query cannot be performed
- **THEN** narrative generation continues with lexical or recent knowledge patterns

### Requirement: Knowledge library and reindexing
The system SHALL expose stored patterns and their vector status and SHALL allow a user to reindex existing knowledge without resubmitting raw sources.

#### Scenario: Existing V1 knowledge needs vectors
- **WHEN** a user starts reindexing
- **THEN** the system processes stored pattern metadata and returns indexed and pending counts

### Requirement: Transient crawler ingestion
The system SHALL treat content received from the compliant crawler exactly as one-time knowledge-import input and SHALL not persist crawler HTML, page text, crawl logs, or Nutch crawl artifacts in MongoDB, Qdrant, or application logs.

#### Scenario: Crawler submits a page
- **WHEN** the crawler submits text to the existing knowledge-import API
- **THEN** existing extraction and indexing paths store only compact pattern metadata and vectors derived from it

### Requirement: Negative reviewer lesson metadata
The system SHALL support storing compact positive and negative reviewer lessons as knowledge metadata, including a diagnosis, root cause, recommended fix, failure dimensions, and evidence-source labels when available. Generation SHALL treat low-naturalness or explicitly negative lessons as constraints to avoid rather than prose examples to copy.

#### Scenario: Positive lesson is stored
- **WHEN** an operator adds a near-approved narrative lesson
- **THEN** MongoDB stores its reusable hook, voice, process, link, coherence pattern, and optional positive diagnosis without raw source text

#### Scenario: Reviewer lesson is stored
- **WHEN** an operator adds a negative narrative lesson
- **THEN** MongoDB stores only its pattern fields and diagnosis metadata, and Qdrant receives the derived compact metadata after reindexing

#### Scenario: Negative lesson is retrieved
- **WHEN** a related narrative topic retrieves a lesson marked `negative` or with naturalness 2 or lower
- **THEN** the narrative prompt tells the model to avoid the diagnosed failure mode and never reproduce source text

#### Scenario: Positive lesson is retrieved
- **WHEN** a related narrative topic retrieves a lesson marked `positive` with naturalness 4 or higher
- **THEN** the narrative prompt uses its pattern fields as guidance while preserving the current topic, persona, reference, and a different valid narrative shape when appropriate

### Requirement: Feedback lessons use diagnosis metadata
The Knowledge Engine SHALL accept positive and negative lessons generated from approved reviewer feedback and SHALL index their compact metadata through the existing orchestrator and Qdrant path.

#### Scenario: Feedback lesson is indexed
- **WHEN** the learning runner creates a lesson with diagnosis fields
- **THEN** the Knowledge record is stored without raw narrative source text and receives a vector status

#### Scenario: Indexing is unavailable
- **WHEN** Qdrant or the embedding model is unavailable during learning
- **THEN** metadata remains stored as pending and the run reports the recoverable failure
