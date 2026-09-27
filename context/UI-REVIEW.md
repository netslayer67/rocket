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

## Narrative failure-progress review (2026-09-23)

Route reviewed: `/` Narrative Studio, failed generation state.

- Anti-slop: retained the existing plain progress surface, text state, bar, and color roles. No card, animation, icon, gradient, dependency, or decorative error treatment was added.
- State clarity: an SSE error now remains below 100% and says `Proses gagal`; success alone reaches 100%. The safe server message stays readable alongside the percentage, so color and bar length are not the sole indicators.
- Responsive and accessibility: the existing `aria-live` status and semantic progressbar remain unchanged. The flex layout retains a shrinking text block and fixed percentage, so it wraps within the existing narrow viewport behavior; keyboard and reduced-motion behavior are unchanged because no control or motion was added.
- Simpler alternative rejected: retaining 100% and changing only the wording would still communicate completion visually. A non-success value is necessary to align the visual state with the persisted job outcome.

## Content sequence review (2026-09-27)

Route reviewed: `/` Narrative Studio, production Next build and the rendered component structure for the draft form and review queue.

- Anti-slop: reuses the existing slate surface, native buttons, fields, dividers, and text hierarchy. No dependency, gradient, glow, icon tile, metric wall, decorative image, or motion was added.
- Responsive and overflow: reference fields use the existing one-column-to-`md` grid; the five-reference cap prevents an unbounded form. Sequence posts use a vertical ordered list, `break-words`, and normal wrapping, so URLs and long text remain inside a narrow card.
- Accessibility: every added input retains a visible label; add/remove and link controls are native buttons and links; the sequence is a semantic `section`/`ol` with textual role, objective, link intent, and publish scope.
- Contrast and motion: existing solid slate/cyan text roles remain; role and status are written as text, not color alone. No new animation was added, so the existing reduced-motion policy is unchanged.
- Simpler alternative rejected: rendering all replies as one long body would hide purpose and link context. The compact ordered list is retained because it supports the manual review decision without a new dashboard layer. Rollback condition: if creator testing shows more than four replies are routinely needed, add a dedicated sequence editor in a separate change instead of expanding this card indefinitely.

## Agent-stage observability review (2026-09-27)

Route reviewed: `/` generation progress and `/monitoring` workflow map.

- Anti-slop: retains the existing progress panel and workflow graph. The change adds factual owner text and a compact active/waiting sentence, not new cards, score widgets, glow, simulated pulses, icons, or a second dashboard.
- State clarity: the draft progress names the agent currently doing work. The map names active and waiting agents from persisted events; Learning and Analytics remain visually muted until actual evidence or captured outcomes exist.
- Responsive and accessibility: the agent summary is normal wrapping text above the existing horizontally scrollable graph. Node labels state active or waiting to assistive technology, and existing focus/reduced-motion behavior is unchanged.
- Simpler alternative rejected: making every node cyan after a draft would be shorter but false. Preserving the event-derived active window makes the operational state trustworthy. Rollback condition: if the summary becomes too long with future agents, replace it with a native disclosure rather than shrinking text or adding an icon-only legend.

## Reference fallback origin review (2026-09-27)

Route reviewed: `/` Narrative Studio angle picker in the production build.

- Anti-slop: the change reuses the existing picker surface and adds one factual text line only for constrained metadata fallback. No badge wall, new card, gradient, icon, dependency, image, or animation was added.
- Accessibility and responsive: the existing native select and labeled field remain keyboard-operable. The fallback sentence uses normal wrapping within the existing `md:col-span-2` container; the production build completed type validation and the text remains understandable without amber color.
- Motion and contrast: no motion changed. Amber text is supplemental status, while the sentence itself states the limitation; the surrounding slate and body-text hierarchy remain unchanged.
- Simpler alternative rejected: silently returning the fallback is shorter but materially misleading. A single sentence is retained; a modal or diagnostics panel would be excessive until creators need provider-level troubleshooting here.

## Model-route and retrieval monitoring review (2026-09-27)

Route reviewed: `/monitoring` existing timeline and workflow map.

- Anti-slop: reuses existing text timeline and map state. No surface, card, icon, gradient, glow, dependency, chart, or motion was added.
- Responsive and accessibility: rejection code is text in the existing `break-words` timeline, so long model names wrap on narrow screens. Existing semantic text, keyboard-safe retry control, contrast, and reduced-motion behavior remain unchanged.
- Simpler alternative rejected: a provider-detail panel would expose too much and add UI for a small diagnostic. The bounded code is enough to distinguish failure class; add more only if repeated operator diagnosis proves it necessary.
