## MODIFIED Requirements

### Requirement: Accessible input and feedback

The dashboard SHALL provide visible labels for inputs, text-based status, clear disabled states for user actions, an explicit control that can fill the narrative topic and reference title from a valid reference URL, estimated progress for pending narrative-form actions, and an anti-slop review for any materially changed UI surface.

#### Scenario: Creator cannot generate yet

- **WHEN** no persona exists
- **THEN** the generation action is disabled and explains that a persona is required

#### Scenario: Creator requests link suggestions

- **WHEN** a creator provides a valid reference URL and chooses the suggestion control
- **THEN** the dashboard fills editable topic and reference-title inputs and shows text-based feedback

#### Scenario: Narrative action is pending

- **WHEN** a creator requests a suggestion or generates a narrative
- **THEN** the dashboard shows an accessible estimated-progress percentage until the request settles

#### Scenario: Creator reviews a changed surface

- **WHEN** a form, status panel, card, or navigation surface is materially changed
- **THEN** the change records an anti-slop, contrast, keyboard, and narrow-viewport review before acceptance
