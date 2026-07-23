## ADDED Requirements

### Requirement: Feedback lessons use diagnosis metadata
The Knowledge Engine SHALL accept positive and negative lessons generated from approved reviewer feedback and SHALL index their compact metadata through the existing orchestrator and Qdrant path.

#### Scenario: Feedback lesson is indexed
- **WHEN** the learning runner creates a lesson with diagnosis fields
- **THEN** the Knowledge record is stored without raw narrative source text and receives a vector status

#### Scenario: Indexing is unavailable
- **WHEN** Qdrant or the embedding model is unavailable during learning
- **THEN** metadata remains stored as pending and the run reports the recoverable failure
