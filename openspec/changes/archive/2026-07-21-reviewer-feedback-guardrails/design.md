## Context

The current reviewer catches banned phrases, missing first-person voice, article-style titles, broken scene coherence, and bare reference links. It does not explicitly require a specific information gap or reject a broad, forced question at the end. Retrieved knowledge also has no marker in the generation prompt that distinguishes a low-naturalness lesson from a pattern worth imitating.

## Goals / Non-Goals

**Goals:**

- Turn the basketball-trade assessment into deterministic V1 review rules.
- Give generation enough metadata to avoid negative lessons.
- Store one compact anti-pattern knowledge record and index it through the existing path.

**Non-Goals:**

- No new scoring service, feedback dashboard, or automatic model training.
- No raw thread, screenshot, full assessment transcript, or private source content in MongoDB/Qdrant.
- No change to manual approval or publishing behavior.

## Decisions

- Add `topic` to `NarrativeReviewContext` and use it only to strengthen reviewer messaging and reference-bridge checks; semantic relevance remains a generation responsibility rather than a brittle keyword classifier.
- Require one concrete information-gap cue (`penasaran`, `heran`, `kenapa`, `kok`, `ternyata`, `padahal`, `masih kepikiran`, or similar) and block generic closing questions such as “menurut kamu?” when they are the only discussion device.
- Include `sourceLabel` and `naturalness` in compact generation pattern context. Labels starting with `Negative lesson` or patterns scored at 2 or below are constraints to avoid, not examples to imitate.
- Seed a metadata-only knowledge record with `hookType: anti-pattern`, `naturalness: 1`, and a compact failure summary. Use the existing Mongo model and Qdrant reindex route; no new collection or script is retained.

## Risks / Trade-offs

- [Legitimate concise drafts lack an explicit curiosity cue] → The cue list includes natural Indonesian observation words and only blocks before approval; the creator can edit or regenerate.
- [Keyword relevance remains imperfect] → The reviewer requires a textual bridge and a human-readable topic/reference context, while semantic judgment stays with the orchestrator.
- [Negative lesson retrieval is not guaranteed] → Static prompt rules remain authoritative; the knowledge record is an additional learning signal.

## Migration Plan

1. Add reviewer checks, generation context, and tests.
2. Insert the compact negative lesson into `knowledge` idempotently and reindex metadata.
3. Run line checks, tests, and builds.
4. Deploy API and verify the reviewed failure remains blocked while a natural rewrite can pass.

## Open Questions

None.
