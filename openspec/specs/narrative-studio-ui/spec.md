# Narrative Studio UI

## Purpose

Define the user-facing V1 workflow for creating persona-aligned narratives and explicitly approving them before manual publishing.
## Requirements
### Requirement: Guided V1 workspace

The dashboard SHALL present the V1 workflow in the order orientation, setup, narrative draft, and manual approval. The layout SHALL be mobile-first and compact by default, place optional connection, knowledge-library, and analytics operations in labeled native disclosures, expand independent setup sections only at wider breakpoints, and use literal Indonesian copy that names each action and result.

#### Scenario: Creator opens the dashboard

- **WHEN** the dashboard data is available
- **THEN** the creator sees a short orientation, useful summary counts, the setup and draft actions, and the latest review queue before optional maintenance details

#### Scenario: Creator opens on a narrow viewport

- **WHEN** the dashboard is viewed at a phone width
- **THEN** primary sections stack in order, controls wrap or fill the available width, text wraps inside the viewport, and no primary action requires horizontal scrolling

### Requirement: Accessible input and feedback

The dashboard SHALL provide visible labels for inputs, text-based status, clear disabled states for user actions, an explicit control that can fill the narrative topic and reference title from a valid reference URL, estimated progress for pending narrative-form actions, server-reported progress for narrative generation, an immediately visible confirmed draft after generation, plain-language learning-boundary guidance in the analytics panel, and an anti-slop review for any materially changed UI surface. Supporting copy SHALL explain the purpose and next step once, without abstract marketing language.

#### Scenario: Creator cannot generate yet

- **WHEN** no persona exists
- **THEN** the generation action is disabled and explains that a persona is required

#### Scenario: Creator requests link suggestions

- **WHEN** a creator provides a valid reference URL and chooses the suggestion control
- **THEN** the dashboard fills editable topic and reference-title inputs and shows text-based feedback

#### Scenario: Narrative action is pending

- **WHEN** a creator requests a suggestion or generates a narrative
- **THEN** the dashboard shows an accessible estimated-progress percentage until the request settles

#### Scenario: Narrative job is active

- **WHEN** the API returns a generation jobId
- **THEN** the dashboard opens the job's SSE stream, displays the server stage and progress, and disables duplicate generation controls

#### Scenario: Generated draft is confirmed

- **WHEN** the SSE stream emits a saved narrative in its complete event
- **THEN** the draft appears in the review queue without requiring a separate refresh action

#### Scenario: Stream fails

- **WHEN** the SSE stream emits an error or closes before completion
- **THEN** the dashboard stops the pending state, reports a readable error, and leaves existing drafts unchanged

#### Scenario: Creator reads learning guidance

- **WHEN** the creator expands the analytics panel
- **THEN** it explains that explicitly approved feedback is learned automatically, outcome candidates still need explicit promotion, and no manual learning trigger is displayed

#### Scenario: Creator reviews a changed surface

- **WHEN** a form, status panel, card, or navigation surface is materially changed
- **THEN** the change records an anti-slop, contrast, keyboard, narrow-viewport, overflow, and reduced-motion review before acceptance

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

### Requirement: Single-profile studio setup
The dashboard SHALL display one active-persona editor rather than a persona list or selector. The editor SHALL group core identity, thinking style, claim boundaries, and current interests in clear fields, identify archived history succinctly, and show rolling review signals without adding decorative UI or hiding the manual approval boundary.

#### Scenario: Creator opens the setup step
- **WHEN** the dashboard loads
- **THEN** the creator can create or update the one active profile and sees that it is used for every new draft

#### Scenario: Creator makes a draft
- **WHEN** an active profile exists
- **THEN** the draft form names that profile and does not offer a persona selector

#### Scenario: Creator uses a narrow viewport
- **WHEN** the profile editor or quality signals are viewed on a phone-width viewport
- **THEN** labels, controls, and status text stack without horizontal scrolling and remain keyboard accessible

### Requirement: Reviewable retrieval and quality context
The studio SHALL show each draft's bounded retrieval mode/count and deterministic quality dimensions in the existing review flow. It SHALL use plain text, preserve manual approval, remain readable at narrow viewport widths, and explain that the score is a draft gate rather than an outcome or model-training metric.

#### Scenario: Creator views a generated draft
- **WHEN** a new or existing draft appears in the review queue
- **THEN** the creator can see its retrieval summary and quality dimensions before choosing manual approval

#### Scenario: Creator uses a narrow viewport
- **WHEN** the review card is viewed on a phone-width viewport
- **THEN** retrieval and quality information wraps inside the card without horizontal scrolling or color-only meaning
