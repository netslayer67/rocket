# Narrative Studio UI

## Purpose

Define the user-facing V1 workflow for creating persona-aligned narratives and explicitly approving them before manual publishing.

## Requirements

### Requirement: Guided V1 workspace
The dashboard SHALL present the V1 workflow in the order persona, knowledge pattern, narrative draft, and manual approval.

#### Scenario: Creator opens the dashboard
- **WHEN** the dashboard data is available
- **THEN** the creator sees summary counts, clear workflow sections, and the latest review queue

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

### Requirement: Manual approval remains explicit
The dashboard SHALL show reviewer notes before a draft can be approved, SHALL disable approval for a draft with any blocking reviewer warning, SHALL evaluate current deterministic reviewer rules for previously stored drafts, and SHALL not publish to an external platform.

#### Scenario: Creator approves a draft
- **WHEN** the creator chooses manual approval on a draft without a blocking reviewer warning
- **THEN** the dashboard marks it approved through the API without sending it to an external platform

#### Scenario: Draft fails a quality gate
- **WHEN** the reviewer records a blocking naturalness, human-voice, or link-context warning
- **THEN** the dashboard shows the warning and keeps the manual approval action unavailable

#### Scenario: Previously stored draft is loaded
- **WHEN** a draft was stored before a current quality rule existed
- **THEN** the dashboard shows any newly detected blocking warning and keeps approval unavailable
