## Why

Generated drafts can use predictable contrast-reframing language such as "bukan X, tapi Y" and em dashes. These patterns make the writing feel generic and confuse rather than engage readers.

## What Changes

- Add a deterministic anti-pattern review for generic contrast-reframing phrases, common AI filler, and em dashes.
- Instruct narrative generation to prefer observed, personal, or unexpected-angle openings instead of prohibited framing.
- Keep a violating draft as `draft`, show an actionable reviewer note, and prevent manual approval until it is regenerated or edited.
- Update the local demo narrative so testing reflects the same naturalness rules.

## Capabilities

### New Capabilities

- `narrative-naturalness`: Detect prohibited generic AI patterns and guide narrative generation toward observation-led language.

### Modified Capabilities

- `narrative-studio-ui`: Show blocking reviewer feedback and preserve explicit manual review for drafts that fail naturalness checks.

## Impact

- Affects the NestJS narrative prompt, deterministic reviewer, demo output, review queue UI, and focused tests.
- No new dependency, persistence field, external API, automatic publishing, or raw-source storage.
