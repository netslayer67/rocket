## ADDED Requirements

### Requirement: Mobile-first creator sequence

The dashboard SHALL present one clear sequence of semantic sections: orientation, persona, knowledge patterns, narrative drafting, and review. The default layout SHALL be a single column with at least 16px viewport padding, readable wrapping, and no horizontal overflow; independent setup sections MAY become columns at wider breakpoints.

#### Scenario: Creator opens on a phone

- **WHEN** the dashboard is viewed at a narrow viewport
- **THEN** each workflow appears in creator order, controls remain reachable, and no content or action is clipped horizontally

#### Scenario: Creator opens on a wide screen

- **WHEN** the dashboard is viewed at a desktop viewport
- **THEN** independent setup tasks may share a row while narrative generation and review retain full reading width

### Requirement: Literal workflow copy

The dashboard SHALL use concise Indonesian headings and supporting text that name the action and its result. It MUST NOT use abstract product slogans or generic AI marketing language as the primary explanation of a workflow.

#### Scenario: Creator reads the page introduction

- **WHEN** the dashboard is loaded
- **THEN** the introduction explains what the creator can make and the next action in plain language within one short reading measure

#### Scenario: Creator reads a workflow section

- **WHEN** a workflow section is visible
- **THEN** its heading, helper text, and controls explain the input, outcome, and next step without repeating the same instruction

### Requirement: Explicit interface states

Every primary workflow control SHALL expose idle, pending, success, error, and disabled states through text or an accessible status. Disabled controls SHALL explain the missing prerequisite, and asynchronous progress SHALL remain an estimate rather than claiming backend telemetry.

#### Scenario: Required setup is incomplete

- **WHEN** a creator has not supplied the prerequisite persona, pattern, or reference
- **THEN** the related action is disabled and the interface states what must be completed first

#### Scenario: A workflow is running

- **WHEN** a creator submits a persona, pattern, suggestion, or narrative action
- **THEN** the initiating control is disabled, progress/status text is visible, and the final success or error message is announced
