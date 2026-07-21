## ADDED Requirements

### Requirement: Guided V1 workspace
The dashboard SHALL present the V1 workflow in the order persona, knowledge pattern, narrative draft, and manual approval.

#### Scenario: Creator opens the dashboard
- **WHEN** the dashboard data is available
- **THEN** the creator sees summary counts, clear workflow sections, and the latest review queue

### Requirement: Accessible input and feedback
The dashboard SHALL provide visible labels for inputs, text-based status, and clear disabled states for user actions.

#### Scenario: Creator cannot generate yet
- **WHEN** no persona exists
- **THEN** the generation action is disabled and explains that a persona is required

### Requirement: Manual approval remains explicit
The dashboard SHALL show reviewer notes before a draft can be approved and SHALL not publish to an external platform.

#### Scenario: Creator approves a draft
- **WHEN** the creator chooses manual approval on a draft
- **THEN** the dashboard marks it approved through the API without sending it to an external platform
