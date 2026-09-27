## Why

Rocket currently creates one narrative body with one fixed reference position. That shape cannot express the creator's approved content patterns: a main post that earns attention, followed by replies that deliver utility, contextual links, and a grounded closing. It also makes a product reference look like the destination instead of one useful part of a conversation.

## What Changes

- Add a reviewable content sequence to each new draft: one main post and up to three replies, each with a clear objective.
- Model links as contextual placements with a declared intent and product role, rather than a universal end-of-post CTA.
- Add a creator-supplied media brief that describes the proof or identification role of an image/video without inventing proof or publishing media.
- Extend deterministic review so a sequence can be blocked when links are detached, claims lack evidence, or a high-risk allegation is framed as persuasion.
- Update the studio review card to make post/reply structure, link context, and media requirement readable on narrow and wide screens.

## Capabilities

### New Capabilities

- `content-sequence-planning`: Generates and persists an optional, reviewable Threads-shaped post/reply plan with contextual link intents and media briefs.

### Modified Capabilities

- `narrative-studio-ui`: The review workflow displays a generated sequence and its reviewable context while retaining explicit manual approval.
- `narrative-authenticity-review`: The reviewer evaluates contextual link placement, claim risk, and sequence-level commercial pressure.

## Impact

Affected areas are narrative DTOs, schema, output parsing, generation/review prompts, API listing types, and the existing studio draft card. No dependency, crawler, external search provider, media upload, reply publishing, or automatic publishing is added. External research/discovery remains a separate bounded change because its source permissions and caching policy must be implemented before it can supply generation context.
