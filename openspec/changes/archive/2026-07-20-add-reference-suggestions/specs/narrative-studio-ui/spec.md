## MODIFIED Requirements

### Requirement: Accessible input and feedback
The dashboard SHALL provide visible labels for inputs, text-based status, clear disabled states for user actions, and an explicit control that can fill the narrative topic and reference title from a valid reference URL.

#### Scenario: Creator cannot generate yet
- **WHEN** no persona exists
- **THEN** the generation action is disabled and explains that a persona is required

#### Scenario: Creator requests link suggestions
- **WHEN** a creator provides a valid reference URL and chooses the suggestion control
- **THEN** the dashboard fills editable topic and reference-title inputs and shows text-based feedback
