# V1 UI Review Record

Route reviewed: `/` (Narrative Studio), including narrative cards, feedback disclosure, manual metrics, and persona thinking-style fields.

- Anti-slop: reused existing Tailwind surfaces, semantic `details`, labels, and one action hierarchy. No new dependency, glow, gradient, icon tile, or decorative animation.
- Contrast: existing slate/cyan/amber/emerald text roles remain paired with labels; no status relies on color alone.
- Responsive: forms use existing `sm`/`md` grids and wrap to one column; numeric controls remain reachable on narrow screens.
- Keyboard: buttons, selects, inputs, and the feedback disclosure are native controls with visible focus styles.
- Motion: no new non-essential motion; existing progress transition keeps the reduced-motion fallback.
- Copy: feedback and analytics labels describe the action directly; no marketing slogans or repeated explanation.

Rejected simpler alternative: hiding feedback and metrics behind an unlabeled admin route. The inline disclosure keeps the manual learning boundary visible where a reviewer already works. Rollback condition: if the card becomes too dense on mobile, move metrics capture to a separate route without changing the API contract.

## Realtime learning guidance review (2026-09-20)

Route reviewed: `/` AnalyticsPanel learning guidance.

- Anti-slop: removed a redundant button and reused the existing panel, typography, and Tailwind tokens. No new component, dependency, badge, icon, animation, or decorative surface was added.
- Contrast: the guidance uses the existing `text-slate-400` body role against the panel background; approval remains expressed in words, not only by color.
- Keyboard: removing the button removes no required workflow; the remaining metric and promotion controls are native, keyboard-accessible controls with existing focus treatment.
- Responsive and overflow: the short paragraph wraps naturally inside the panel, while the existing flex controls retain their wrapping behavior on narrow viewports.
- Motion: no motion was added or changed.
- Copy: the guidance distinguishes automatic learning for explicitly allowed feedback from review-required metric candidates; it does not claim worker-health telemetry or automatic DNA promotion.

Rejected simpler alternative: silently remove the button. The single sentence is retained so creators understand both the automatic path and the approval boundary. Rollback condition: if operational learning is disabled, restore only an operator-facing recovery control after the worker configuration is repaired.

## Autonomous internal learning review (2026-09-21)

Route: `/monitoring`, local production build, Chromium with deterministic API fixtures (not production learning activity).

- Anti-slop: a plain heading/status/definition list explains worker state above the existing map. Reuses Tailwind; no new dependency, icon tiles, gradients, glow, fake pulses or fabricated quality percentage.
- State coverage: waiting, synthesizing, unavailable free models, quota, rejected and disabled states rendered successfully; worker state is separate from connection health. Legacy learning action is labeled manual recovery.
- Responsive: automated checks at 375, 768 and 1440 CSS pixels found no document overflow; wide and narrow screenshots were visually inspected. The graph keeps its intentional internal scroll, keyboard focus and equivalent linear timeline. Source nodes no longer clip against the canvas edge.
- Keyboard: focusable graph region and native recovery buttons were reached with Tab; visible focus ring confirmed. No inaccessible custom controls were added.
- Motion: reduced-motion emulation confirmed `animation-name: none` on active nodes. Waiting state has no active learning nodes; actual worker synthesis activates only the internal-source/learning path.
- Typography/contrast: new panel text is at least 14px. Slate-400 or brighter text replaces the low-contrast slate-500 labels on the touched map, summary and timeline. Sequential h1/h2 hierarchy retained; status remains textual.
- Simpler alternative rejected: relabeling SSE alone would leave the worker's actual state invisible. The new status list is retained because it explains missing knowledge growth. No new visual exception; the previously documented bounded graph-scroll exception remains.
