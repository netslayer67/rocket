## ADDED Requirements

### Requirement: Transient crawler ingestion
The system SHALL treat content received from the compliant crawler exactly as one-time knowledge-import input and SHALL not persist crawler HTML, page text, crawl logs, or Nutch crawl artifacts in MongoDB, Qdrant, or application logs.

#### Scenario: Crawler submits a page
- **WHEN** the crawler submits text to the existing knowledge-import API
- **THEN** existing extraction and indexing paths store only compact pattern metadata and vectors derived from it
