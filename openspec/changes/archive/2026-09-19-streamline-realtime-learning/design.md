## Context

`apps/web` currently exposes a POST `/learning/run` call through `useStudio` and an AnalyticsPanel button. `apps/api` already learns explicitly approved feedback immediately and can drain the same approved backlog on its Railway interval. Outcome metrics remain manually captured and only create reviewable candidates; promotion is separately typed and approved.

## Goals / Non-Goals

**Goals:**

- Make the dashboard match the deployed automatic-feedback workflow.
- State the two approval boundaries in the existing analytics panel.
- Remove the dead client request and its prop chain.

**Non-Goals:**

- Do not approve feedback automatically, ingest outcome metrics automatically, or promote candidates to DNA.
- Do not change `apps/api`, schemas, endpoint contracts, scheduling, or add a status-polling API.

## Decisions

- Delete the dashboard trigger, its page prop, and the hook method. The retained authenticated API endpoint remains an operational fallback without exposing a duplicate creator workflow.
- Add static, literal Indonesian guidance next to the existing learning signals. Static copy is more truthful than an "active" badge because the browser does not observe the worker health or backlog.
- Reuse the AnalyticsPanel's current Tailwind typography and card. A new component, polling state, or dependency would add surface area without changing the learning behavior.

## Risks / Trade-offs

- [Worker configuration is disabled] → The dashboard text does not prove scheduler health; Railway monitoring remains the operational source, while newly approved feedback still takes the immediate learning path.
- [Creator expects metric rows to alter DNA] → Copy explicitly says a candidate still needs approval, and existing promotion controls remain unchanged.
- [Future operator needs a manual recovery] → The authenticated server endpoint is preserved for operations.

## Migration Plan

Deploy the web change through the existing Vercel flow. Roll back by reverting this web-only change; no data migration, API deployment, or persisted state is involved.

## Open Questions

None.
