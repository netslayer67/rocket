## Why

The latest draft passed the narrow anti-pattern check but read like a news summary, ignored the selected persona, and appended an unrelated link. Correct grammar is not enough: a narrative must have a human point of view, a specific information gap, and a visible contextual bridge to its reference.

## What Changes

- Strengthen the generation brief so a thread begins in a persona-matched first-person voice and treats the reference as a required contextual anchor.
- Resolve transient reference metadata at generation time when possible, so a manually typed title cannot disguise an unrelated URL.
- Extend deterministic review to block article-style hooks, missing human voice, missing link context, and generic appended-reference phrasing; request one bounded live rewrite.
- Make every blocking reviewer warning disable manual approval in the dashboard.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `narrative-naturalness`: Add human-voice and contextual-reference quality gates and apply the existing bounded rewrite to them.
- `narrative-studio-ui`: Treat every blocking reviewer warning as ineligible for manual approval.

## Impact

Updates the narrative prompt, transient reference handling, deterministic reviewer, and review-queue button state. No database migration, publishing action, stored raw page content, or dependency is added.
