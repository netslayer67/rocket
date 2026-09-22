## 1. Canonical profile and contracts

- [x] 1.1 Add active/archive and layered-profile fields with a one-active Mongo constraint, then expose canonical profile update/read APIs.
- [x] 1.2 Remove caller-controlled persona selection from new narrative input and resolve only the active profile during generation.
- [x] 1.3 Add focused persona lifecycle and generation-contract tests.

## 2. Persona-scoped knowledge and learning

- [x] 2.1 Scope new knowledge, feedback lessons, outcome lessons, retrieval, and autonomous evidence to the active persona without assigning legacy metadata by guesswork.
- [x] 2.2 Add focused retrieval, feedback, and autonomous-evidence regression tests for archived and unscoped records.

## 3. Quality signals and studio UI

- [x] 3.1 Add an active-persona rolling diagnostic summary that reports review signals without fabricating a quality score.
- [x] 3.2 Replace the persona list/select UI with an accessible one-profile editor and compact quality signals.
- [x] 3.3 Record the anti-slop, keyboard, contrast, narrow viewport, overflow, and reduced-motion review in `context/AI-SLOP.md`.

## 4. Verification and delivery

- [x] 4.1 Validate the OpenSpec change and run focused API tests.
- [x] 4.2 Run `npm run check:lines`, `npm test`, and `npm run build`.
- [x] 4.3 Sync delta specifications into main specs and archive the completed change.
