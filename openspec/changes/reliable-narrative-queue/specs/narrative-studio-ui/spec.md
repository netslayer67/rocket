# Narrative Studio UI

## MODIFIED Requirements

### Requirement: Accessible input and feedback
The dashboard SHALL provide visible labels for inputs, text-based status, clear disabled states for user actions, an explicit control that can fill the narrative topic and reference title from a valid reference URL, estimated progress for pending narrative-form actions, an immediately visible confirmed draft after generation, and an anti-slop review for any materially changed UI surface. Supporting copy SHALL explain the purpose and next step once, without abstract marketing language.

#### Scenario: Generated draft is confirmed
- **WHEN** the API returns a saved narrative from the generation action
- **THEN** the draft appears in the review queue without requiring a separate refresh action
