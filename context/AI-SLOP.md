# AI Slop Guardrails

## Purpose

This is the canonical UI quality policy for Rocket. It prevents the dashboard from drifting into a generic AI-generated SaaS aesthetic while preserving the product feeling defined in `context/DESIGN.md`: calm, editorial, readable, and useful for a creator reviewing narratives.

The policy is based on the pattern catalog at [Impeccable Slop](https://impeccable.style/slop/). The source catalog describes 46 recurring tells across visual details, typography, color and contrast, layout and space, motion, copy, imagery, and general quality. Its specimen pages are a detector demonstration, not a visual style to copy.

## Strict default

Every new screen, component, Tailwind treatment, or substantial visual change MUST pass this checklist before acceptance. A flagged pattern is rejected when it is decorative, repeated, or chosen only because it feels modern, premium, futuristic, or "AI". A documented product-serving exception is allowed; the exception must name the user value, scope, simpler alternative considered, and rollback condition.

Critical failures block acceptance:

- WCAG contrast failure, invisible focus, missing labels, or keyboard-inaccessible controls.
- Horizontal overflow, clipped content, clipped menu/popover, or broken/placeholder imagery.
- A repeated generic pattern in a primary workflow that weakens hierarchy or comprehension.

## Visual details

- Do not pair a thick accent border with a rounded card; use a defined edge or radius, not both competing.
- Do not use a thick colored side-tab border as the default card accent.
- Do not use glassmorphism, blur, glow borders, or translucent cards as decoration. Use them only to solve a real layering problem.
- Do not pair a hairline border with a wide diffuse shadow by reflex. Choose a defined edge or soft elevation.
- Do not use repeating-gradient stripes as surface texture without a clear content purpose.
- Keep small cards at a moderate radius, normally 12–16px. Reserve full pills for tags and compact actions.
- Do not ship hand-drawn mascot SVGs or crude scene illustrations as a placeholder for real art. Use a real asset or no illustration.
- Decorative icons MUST remain subordinate to the content they introduce; never let an icon container become the visual subject.

## Typography

- Establish visible hierarchy. Adjacent type steps SHOULD differ by at least a 1.25 ratio.
- Do not stack a rounded icon tile above every feature heading. Prefer an icon in flow or a side-by-side relationship.
- Do not use an oversized italic serif hero as the default AI-startup signal. Use it only when an editorial concept genuinely needs it.
- Do not repeat tiny uppercase eyebrow chips above every section. Use a breadcrumb, a meaningful label, or the heading itself.
- Do not repeat tracked section kickers as scaffolding when content, artifacts, or structure can carry the hierarchy.
- Keep long hero headlines compact enough to leave useful content above the fold; do not blow a full sentence up to display size.
- Avoid destructive negative letter spacing that collapses character shapes.
- Do not choose Inter, Geist, Space Grotesk, or another fashionable face by reflex. Select a typeface for the product voice and record the rationale.
- Do not use one font family for every role when a deliberate display/body contrast is needed. Do not add a font dependency for a hypothetical need.
- Body copy MUST NOT be all caps. Uppercase is reserved for short labels.

## Color and contrast

- Do not use purple/violet gradients, cyan-on-dark accents, or neon glows as the default "AI" palette.
- Do not use gradient text for headings, metrics, or body copy; text needs a stable solid color for scanning.
- Do not place gray text on a colored surface when it weakens readability.
- Do not default to warm cream/beige as a generic "tasteful" surface.
- Every color MUST have a semantic job: content, action, state, focus, or separation.
- Body text MUST meet WCAG AA contrast of at least 4.5:1; large text and essential UI MUST meet at least 3:1.
- Status MUST be communicated with text or an icon label in addition to color.

## Layout and space

- Do not use the big-number-plus-three-stats hero metric template unless the metric is the user's actual next decision.
- Do not repeat identical icon-heading-copy cards as the default page layout.
- Use spacing rhythm: tight grouping for related controls, generous separation between workflows. One spacing value everywhere is forbidden.
- Do not place cards inside cards inside cards. Flatten hierarchy with spacing, headings, and dividers.
- Numbered section markers (01/02/03) are allowed only when the content is a real sequence.
- Keep reading measures between 65ch and 75ch; lines over about 80 characters require a deliberate reason.
- Containers MUST prevent overflow. Text wraps, controls remain reachable, and horizontal scrolling is never accidental.
- A clipping container MUST NOT wrap a tooltip, menu, or popover that needs to escape it.
- Bordered or colored surfaces MUST have at least 12px internal padding; the viewport MUST have at least 16px horizontal breathing room.
- Do not use layout nesting to manufacture depth. Prefer one surface, one heading, one action hierarchy.

## Motion

- Do not use bounce or elastic easing for ordinary UI. Use a restrained ease-out transition.
- Do not animate width, height, padding, or margin. Use transform, opacity, or a grid row transition when necessary.
- Do not scale or rotate imagery on hover by default. Images remain still unless the interaction communicates a real state.
- Every non-essential animation MUST have a `prefers-reduced-motion: reduce` fallback.
- Motion MUST explain state, progress, or spatial change; decoration alone is not sufficient.

## Copy and imagery

- Do not overuse em dashes in interface copy. Use a period, comma, colon, or parentheses when it reads more naturally.
- Avoid generic marketing buzzwords such as “supercharge,” “world-class,” “enterprise-grade,” and “next-generation.” Name the action and result literally.
- Avoid repeated aphoristic or manufactured-contrast cadence in UI copy. The product voice is conversational and specific.
- Do not dismiss work as “theater” or use performative slogans. Explain what the interface does.
- Say each instruction once. A label, sublabel, helper, hint, and tooltip MUST not repeat the same sentence.
- Never ship an empty, missing, or placeholder image source. Use a real asset or remove the image.

## Accessibility and responsive review

- Every input has a visible label; placeholder text is not the label.
- Heading levels are sequential and form a navigable document outline.
- Body text is at least 14px; 16px is preferred. Body line-height is at least 1.5.
- Controls are keyboard-operable, have visible focus, and expose status through text or `aria-live` where appropriate.
- Check a narrow viewport, a wide viewport, keyboard navigation, and reduced-motion preference for each material UI change.
- Interactive states include idle, hover/focus, disabled, pending, success, and error where applicable.

## Review record

Before accepting a UI change, record:

1. Rendered route or screenshot checked.
2. Anti-slop categories reviewed and any exceptions.
3. Contrast, heading, keyboard, narrow viewport, overflow, and reduced-motion results.
4. The simplest rejected alternative when an exception remains.

## Ponytail implementation rules

- Reuse existing Tailwind utilities and shared primitives before creating a component or token.
- Prefer semantic HTML and native browser behavior over a dependency.
- Add a new abstraction only after the same UI treatment appears in at least two workflows.
- Delete decorative layers before adding another shadow, gradient, wrapper, icon tile, or animation.
- Do not add a detector package, design-token system, icon library, or visual-regression service until repeated manual findings justify it in a separate OpenSpec change.
- Mark a deliberate shortcut with a `ponytail:` comment and its upgrade condition; do not hide an exception in a generic helper.

## Initial Rocket review

The current V1 dashboard has several intentional, bounded choices: slate surfaces and cyan state text support focus and status; 12px card radii stay within the moderate range; text labels accompany colored status; and progress motion uses a reduced-motion fallback. These are not blanket permission for a neon or glass aesthetic.

Follow-up findings for the next UI pass:

- Repeated `eyebrow` labels appear above multiple workflow headings. This is a known catalog hit (repeated section kickers) and should be removed or consolidated when those sections are next redesigned.
- Summary cards are useful because they expose the creator's actual counts; they are not a marketing hero metric. Keep them only while they support a next decision.
- The estimated progress bar communicates request state. If its animation is changed, prefer a transform-based implementation and retain the reduced-motion fallback.
