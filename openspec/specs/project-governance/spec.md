# Project Governance

## Purpose

Define the project context and maintenance guardrails that keep future Rocket Project changes safe, reviewable, and small.

## Requirements

### Requirement: Maintained project context
The repository SHALL provide architecture, product, design, engineering-rule, and data-schema context documents for contributors and coding agents.

#### Scenario: Contributor prepares a meaningful change
- **WHEN** a contributor starts a feature or behavior change
- **THEN** they can locate the required project context and workflow rules in `context/` and `AGENTS.md`

### Requirement: Source file size guard
The repository SHALL provide an npm command that fails when a source-code file in the application or scripts roots exceeds 200 lines.

#### Scenario: File exceeds limit
- **WHEN** a checked source-code file contains more than 200 lines
- **THEN** `npm run check:lines` exits with a non-zero status and names the file

### Requirement: Spec-driven meaningful changes
The repository SHALL configure OpenSpec locally for Codex and record meaningful behavior or architecture changes as proposal, design, specification, and task artifacts.

#### Scenario: Agent plans a new capability
- **WHEN** an agent receives a meaningful capability request
- **THEN** it can use project-local OpenSpec skills and context before implementation
