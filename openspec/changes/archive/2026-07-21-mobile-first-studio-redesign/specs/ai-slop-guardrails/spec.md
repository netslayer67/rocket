## MODIFIED Requirements

### Requirement: UI changes pass the AI-slop quality gate

The `apps/web` dashboard SHALL be reviewed against the canonical anti-slop policy before a new screen, component, or substantial visual change is accepted. The review SHALL cover visual details, typography, color and contrast, layout and space, motion, copy, imagery, responsive behavior, and accessibility. A mobile-first redesign SHALL record the rendered route, narrow and wide viewport checks, keyboard/focus checks, reduced-motion behavior, and any documented exception.

#### Scenario: New UI passes review

- **WHEN** a developer submits a new or materially changed dashboard view
- **THEN** the review records a pass for the anti-slop checklist, a rendered visual check, and keyboard/narrow-viewport checks where applicable

#### Scenario: Critical quality defect is found

- **WHEN** a view has unreadable contrast, clipped content, broken imagery, missing labels, layout overflow, or repeated generic AI patterns in a primary workflow
- **THEN** the change is rejected until the defect is fixed or an explicit exception is recorded

#### Scenario: Mobile-first layout is changed

- **WHEN** a dashboard surface is reorganized for compact mobile use
- **THEN** the review verifies readable wrapping, touch-reachable controls, sequential headings, visible focus, and a reduced-motion fallback before acceptance

### Requirement: Generic AI visual patterns are opt-in exceptions

The project SHALL reject decorative defaults such as purple/violet gradients, cyan-on-dark glow treatment, gradient text, ubiquitous glassmorphism, side-tab borders on rounded cards, nested card stacks, identical icon-card grids, oversized icon tiles, oversized long hero headlines, repeated eyebrow chips, and extreme card radii. A pattern MAY be used only when it serves a demonstrated product, content, or accessibility need and the review records the reason.

#### Scenario: Decorative pattern has no user value

- **WHEN** a proposed element uses a listed pattern only to make the interface feel modern, premium, futuristic, or "AI"
- **THEN** the reviewer requires a simpler solid surface, type hierarchy, spacing, or native interaction instead

#### Scenario: Intentional pattern is justified

- **WHEN** a listed pattern communicates state, hierarchy, or a real interaction that cannot be expressed more simply
- **THEN** the review records the user value, scope, and rollback condition for the exception

### Requirement: UI quality remains accessible and restrained

The dashboard SHALL use WCAG AA contrast targets, visible labels, sequential heading levels, body text of at least 14px, body line-height of at least 1.5, readable measures of 65ch to 75ch, at least 12px internal spacing in bordered surfaces, keyboard-operable controls, reduced-motion support, and transform/opacity animation instead of layout-property animation.

#### Scenario: Responsive view is reviewed

- **WHEN** a new view is checked at a narrow viewport and with keyboard navigation
- **THEN** text remains within its container, controls remain reachable, focus is visible, and no horizontal overflow or clipped popover occurs

#### Scenario: Motion preference is reduced

- **WHEN** the user enables `prefers-reduced-motion: reduce`
- **THEN** non-essential animation is removed or reduced without hiding status or blocking the workflow
