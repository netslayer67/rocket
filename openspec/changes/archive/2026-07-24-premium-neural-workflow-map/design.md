## Context

`apps/web/src/components/monitoring/monitoring-graph.tsx` currently uses a four-column grid and one straight SVG path. The monitoring API contract and `MonitoringEvent` type already contain enough metadata for a visual map; no new data or dependency is needed. The graph must remain honest in serverless mode: only events within the recent activity window can animate.

## Goals / Non-Goals

**Goals:**

- Give signals, agents, models, and memory a clear left-to-right hierarchy with organic curved connections.
- Make recent persisted activity legible through node state, wire emphasis, and restrained particle motion.
- Preserve keyboard/screen-reader clarity through semantic node text and the existing timeline.
- Keep the implementation within the existing Tailwind + inline SVG stack and 200-line file limit.

**Non-Goals:**

- No real-time simulation, generated events, canvas engine, graph library, or new API endpoint.
- No changes to MongoDB, Qdrant, SSE polling, action confirmation, or serverless limits.

## Decisions

1. **Use one responsive SVG overlay plus HTML nodes.** SVG provides curved Bezier wires and particles without a dependency; HTML keeps text selectable and accessible. A CSS grid remains the small-screen fallback.
2. **Use deterministic node positions.** Four semantic stages use fixed percentages and a small set of branch paths. This is easier to review and avoids a layout engine for a bounded workflow.
3. **Derive active state from the existing 60-second recent event filter.** A path is emphasized only when its source or destination stage has a matching recent event. Historical nodes remain muted and the status copy says idle.
4. **Use restrained semantic colors.** Slate is idle, cyan marks flow, emerald marks memory completion, and amber marks a pending signal. No gradient, glass, or glow surface is introduced; motion is limited to a transform/opacity pulse and disabled under reduced motion.

## Risks / Trade-offs

- [Risk] Fixed paths can diverge if stages change → [Mitigation] Keep stage and path data local, typed, and bounded; update with the workflow contract.
- [Risk] SVG can be visually dense on phones → [Mitigation] retain horizontal overflow with minimum canvas width and the timeline as the readable fallback.
- [Risk] Motion may distract or imply synthetic activity → [Mitigation] animate only recent event paths, expose textual live/idle state, and honor reduced motion.
