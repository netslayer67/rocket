# Reference Angle Discovery

## Purpose

Provide editable, evidence-aware narrative directions from bounded public reference metadata without storing raw page content.

## Requirements

### Requirement: Bounded multi-angle suggestions
The system SHALL return one recommended narrative angle and no more than two alternative angles for a valid reference request, with every angle remaining editable before generation.

#### Scenario: Metadata supports multiple directions
- **WHEN** a public reference preview contains a title, host, or description
- **THEN** the response contains a recommended angle, zero to two alternatives, and no raw page body

#### Scenario: Model returns too many or duplicate angles
- **WHEN** the model returns more than three angles or repeated titles
- **THEN** the parser keeps at most three unique angles and preserves the recommended angle first

#### Scenario: Legacy topic response
- **WHEN** an older model or client returns only `{topic}`
- **THEN** the system converts it into one editable low-confidence recommended angle without breaking the request

### Requirement: Evidence-aware angle contract
Each returned angle SHALL include a confidence in the range 0–1, a concise reason, and one or more provenance labels limited to transient reference metadata, including bounded type/site/author/section/date/price/canonical fields when present. The system MUST NOT present unsupported people, product, endorsement, or performance claims as evidence.

#### Scenario: Metadata-only suggestion
- **WHEN** an angle is derived only from the reference title, description, or host
- **THEN** its evidence labels identify metadata-only provenance and its reason avoids firsthand claims

#### Scenario: Unsupported model claim
- **WHEN** the model attributes an unverified fact or endorsement to a person or product
- **THEN** the parser removes the unsupported evidence text and returns a neutral editable angle

#### Scenario: Incomplete angle fields
- **WHEN** confidence, reason, or evidence is missing or malformed
- **THEN** the parser clamps or defaults the field and returns a valid contract rather than exposing malformed model output

### Requirement: Product-title and generic-template guard
The system SHALL reject a returned product angle that merely repeats the normalized reference title or uses a known generic angle template without a concrete human tension. It MUST retain at most three editable angles and must not use a persona vocabulary word as a standalone rejection rule.

#### Scenario: Model repeats marketplace title
- **WHEN** a model returns an angle that copies the product listing title into “hal kecil”, “sudut lain”, or similarly generic framing
- **THEN** the parser discards that angle and uses the safe metadata-only fallback when no grounded angle remains

#### Scenario: Model returns a concrete tension
- **WHEN** an angle identifies a bounded human situation without unsupported product claims
- **THEN** the parser retains it even if the reference remains metadata-only
