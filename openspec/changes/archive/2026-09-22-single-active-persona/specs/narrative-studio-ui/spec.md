## ADDED Requirements

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
