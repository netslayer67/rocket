## MODIFIED Requirements

### Requirement: Accessible input and feedback
The dashboard SHALL provide visible labels for inputs, text-based status, clear disabled states for user actions, an explicit control that can fill the narrative topic and reference title from a valid reference URL, estimated progress for pending narrative-form actions, server-reported progress for narrative generation, an immediately visible confirmed draft after generation, and an anti-slop review for any materially changed UI surface. Supporting copy SHALL explain the purpose and next step once, without abstract marketing language.

#### Scenario: Creator cannot generate yet
- **WHEN** no persona exists
- **THEN** the generation action is disabled and explains that a persona is required

#### Scenario: Creator requests link suggestions
- **WHEN** a creator provides a valid reference URL and chooses the suggestion control
- **THEN** the dashboard fills editable topic and reference-title inputs and shows text-based feedback

#### Scenario: Narrative job is active
- **WHEN** the API returns a generation jobId
- **THEN** the dashboard opens the job's SSE stream, displays the server stage and progress, and disables duplicate generation controls

#### Scenario: Generated draft is confirmed
- **WHEN** the SSE stream emits a saved narrative in its complete event
- **THEN** the draft appears in the review queue without requiring a separate refresh action

#### Scenario: Stream fails
- **WHEN** the SSE stream emits an error or closes before completion
- **THEN** the dashboard stops the pending state, reports a readable error, and leaves existing drafts unchanged

#### Scenario: Creator reviews a changed surface
- **WHEN** a form, status panel, card, or navigation surface is materially changed
- **THEN** the change records an anti-slop, contrast, keyboard, narrow-viewport, overflow, and reduced-motion review before acceptance
