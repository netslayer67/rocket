## Why

The dashboard still presents a manual "Jalankan learning" action even though approved feedback can be learned immediately and the Railway worker keeps processing the approved backlog. That extra action obscures the continuous-learning flow and makes it unclear that outcome candidates still require a separate human approval before they can affect Narrative DNA.

## What Changes

- Remove the dashboard's manual learning trigger and its unused client-side request.
- Add concise, static guidance in the existing analytics panel explaining that approved feedback is learned automatically and outcome candidates remain review-only.
- Keep the explicit feedback-learning opt-in, idempotent backend processing, candidate review, and approval-to-promote controls unchanged.
- Keep the server-side learning-run endpoint as an operational fallback; it is no longer a required dashboard workflow.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `feedback-learning`: Learning must not require a dashboard button once feedback is explicitly approved.
- `outcome-learning-candidates`: The dashboard must distinguish automatically surfaced candidates from human-approved DNA promotion.
- `narrative-studio-ui`: The analytics view must state the automatic-learning and approval boundaries without adding a manual trigger.

## Impact

Only the existing web analytics component, its page prop, and its studio hook change. No API contract, dependency, data model, or automatic DNA promotion is added.
