## ADDED Requirements

### Requirement: Transparent constrained fallback
When a model result is unavailable, malformed, duplicate, or rejected by the generic-angle guard, the system SHALL return no more than two editable metadata-only angles with explicit fallback origin. It MUST use only observed title-category signals and must not infer product features, price, compatibility, quality, endorsements, or firsthand experience.

#### Scenario: Different recognized categories
- **WHEN** two title-only listings belong to different recognized categories
- **THEN** their fallback angle pair reflects different category-level human situations

#### Scenario: Unknown category
- **WHEN** a title exposes no recognized category signal
- **THEN** the fallback remains neutral, low-confidence, and visibly metadata-only
