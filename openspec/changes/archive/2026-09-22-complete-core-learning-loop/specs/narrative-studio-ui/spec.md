## ADDED Requirements

### Requirement: Reviewable retrieval and quality context
The studio SHALL show each draft's bounded retrieval mode/count and deterministic quality dimensions in the existing review flow. It SHALL use plain text, preserve manual approval, remain readable at narrow viewport widths, and explain that the score is a draft gate rather than an outcome or model-training metric.

#### Scenario: Creator views a generated draft
- **WHEN** a new or existing draft appears in the review queue
- **THEN** the creator can see its retrieval summary and quality dimensions before choosing manual approval

#### Scenario: Creator uses a narrow viewport
- **WHEN** the review card is viewed on a phone-width viewport
- **THEN** retrieval and quality information wraps inside the card without horizontal scrolling or color-only meaning
