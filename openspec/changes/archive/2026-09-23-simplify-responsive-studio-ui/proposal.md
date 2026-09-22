## Why

The Studio and monitoring views expose useful capabilities, but their many equal-weight sections make the next action hard to spot, especially on a phone. The creator needs a compact path for creating and reviewing a draft, while an operator needs the worker status before a detailed event map.

## What Changes

- Reorder and simplify the Studio into a short creator sequence with optional maintenance details visually secondary.
- Make dashboard actions and status wrap predictably on narrow screens while preserving the desktop two-column setup where useful.
- Simplify monitoring into worker status, concise activity summary, expandable technical workflow details, and an event timeline.
- Retain all existing data, actions, manual-approval gates, SSE behavior, and truthful worker states.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `mobile-first-studio-ui`: clarify the compact creator sequence and responsive treatment of optional maintenance content.
- `narrative-studio-ui`: make the next drafting/review action primary without removing any current capability.
- `workflow-monitoring`: prioritize actual worker state and readable timeline over the technical map on all viewports.
- `ai-slop-guardrails`: record the required visual, accessibility, and responsive review.

## Impact

Changes are limited to `apps/web` components, global Tailwind utilities, and UI review records. No API, model, data, publishing, or approval behavior changes. No new dependencies.
