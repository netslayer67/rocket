# Autonomous Internal Learning

## Purpose

Consolidate approved internal writing evidence into bounded, provisional knowledge with free-only AI and durable provenance, independently of browser traffic.

## Requirements

### Requirement: Approved internal evidence only
The system SHALL autonomously consolidate at most six recent approved feedback items, six non-autonomous DNA records, and six approved narratives per batch. It MUST exclude drafts, unapproved feedback, and its own autonomous outputs, and revalidate source eligibility before saving. Imported source bodies MUST NOT be persisted or logged.

#### Scenario: Eligible internal inputs
- **WHEN** approved internal evidence exists
- **THEN** the worker can process it without browser traffic or a button press

#### Scenario: Unapproved or self-generated inputs
- **WHEN** inputs are drafts, unapproved feedback, or autonomous DNA
- **THEN** they cannot become learning evidence

### Requirement: Diagnosis-first reviewed consolidation
The worker SHALL synthesize at most one positive or negative lesson per unchanged batch, with diagnosis, root cause, contextual fix, dimensions, and at least two valid evidence IDs. A second model check MUST accept grounding, novelty, and absence of contradiction before persistence. It MUST NOT promote analytics candidates, publish, fine-tune, or claim measured improvement. Ponytail ceiling SHALL remain two bounded completion tasks plus shape/provenance checks, with no lexical blacklist or mandatory prose structure.

#### Scenario: Supported positive lesson
- **WHEN** a positive diagnosis passes shape, evidence, novelty and reviewer checks
- **THEN** one provenance-linked DNA record is saved for future retrieval

#### Scenario: Supported negative lesson
- **WHEN** a negative diagnosis identifies failure dimensions and passes review
- **THEN** its contextual fix is saved without prohibiting vocabulary or prescribing one narrative sequence

#### Scenario: Unsupported or conflicting lesson
- **WHEN** the output omits diagnosis, cites unknown evidence, repeats an existing lesson, or fails review
- **THEN** no knowledge is saved and the rejected cycle remains observable

### Requirement: Free-only bounded execution
Autonomous calls MUST use only free OpenRouter chat and embedding models, including fallback, with zero-price provider limits. The worker SHALL enforce at most four attempts per UTC day, two per fingerprint per UTC day, a fifteen-minute retry delay, and non-overlapping execution in the supported single-replica deployment. Failed batches SHALL be eligible again on a later UTC day; completed/rejected unchanged batches SHALL not be repeated. Calls MUST time out and failures MUST use sanitized reasons. Missing credentials MUST NOT generate demo knowledge.

#### Scenario: Free model unavailable
- **WHEN** all bounded free model attempts fail or no free model is configured
- **THEN** the worker records unavailability, backs off, and never invokes a paid model

#### Scenario: Truncated or malformed response
- **WHEN** a free model exhausts the output token budget or returns invalid JSON
- **THEN** the response cannot create DNA; fallback and later retries remain within free-model and daily attempt limits rather than permanently treating a formatting failure as an evidence rejection

#### Scenario: Unchanged evidence or quota exhausted
- **WHEN** a batch is already processed or the daily attempt ceiling is reached
- **THEN** subsequent checks make no AI calls and report waiting or quota state

#### Scenario: Persistent restart and partial save
- **WHEN** the worker restarts or retries after a partial save
- **THEN** durable claims and a unique lesson key prevent duplicate lessons and preserve attempt limits

#### Scenario: Disabled worker
- **WHEN** the kill switch is false, or a non-Railway environment has not opted in
- **THEN** no background learning calls run
