## Why

Rocket currently permits an expanding list of personas while learning and retrieval are shared. That weakens a single creator identity and makes feedback difficult to attribute. The product now needs one evolving narrator whose profile, knowledge, and quality signals can be evaluated together.

## What Changes

- **BREAKING**: Replace persona selection during draft generation with the one active persona.
- Store one active profile with separate core identity, thinking style, claim boundaries, and current interests/trends; retain existing voice fields for compatibility.
- Archive prior personas instead of deleting historical drafts. Archived personas cannot generate new drafts or contribute evidence.
- Scope new and autonomous DNA, feedback-derived lessons, retrieval, and outcome lessons to the active persona. Legacy unscoped metadata remains retained but is not used as active-persona learning evidence.
- Add a compact rolling quality summary based on persisted reviewer diagnostics for the active persona. It measures consistency, specificity, generic-AI blockers, and product-injection blockers; it does not claim to prove quality or replace manual review.
- Simplify the studio UI to edit one profile and show its current quality signals.

## Capabilities

### New Capabilities

- `single-active-persona`: Canonical persona lifecycle, persona-scoped learning, and quality summary.

### Modified Capabilities

- `persona-engine`: Persist the expanded profile and use only the active narrator for generation.
- `knowledge-engine`: Scope retrievable knowledge and new lessons to the active narrator.
- `autonomous-internal-learning`: Restrict evidence and saved synthesis to the active narrator.
- `narrative-studio-ui`: Replace persona selection with a single-profile editor and quality status.

## Impact

Changes persona, knowledge, feedback, narrative, and analytics services plus their Mongo schemas; removes `personaId` from new-generation input; updates the studio UI and tests. No new dependency, automatic publishing, raw-source persistence, or model training is introduced. Manual approval remains required.
