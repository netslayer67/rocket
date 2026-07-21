## Context

The current reviewer catches generic phrasing and a small set of concrete scene conflicts. It does not explain when a reference is introduced as a forced destination, when marketplace wording replaces observation, or when a new topic branch appears without setup.

## Goals / Non-Goals

**Goals:**

- Make the failure visible in reviewer notes and block approval when it is strong.
- Keep checks deterministic, local, and under the existing 200-line file limit.
- Give the generator and bounded rewrite a compact rule set that matches the review.

**Non-Goals:**

- No LLM call from the reviewer, no new scoring service, and no claim that lexical checks understand every topic.

## Decisions

Add small lexical heuristics to the existing reviewer. Product injection combines an abrupt marketplace transition, a reference/product mention, and a missing human concern before that mention. Topic drift flags the known unsupported community tangent when the supplied topic does not establish it. Scores are diagnostics; blocking notes remain the approval contract.

## Risks / Trade-offs

- [Heuristic false positive] A creator may intentionally discuss community or a product detail → show the exact reason and allow manual editing, but keep approval blocked until the note is resolved.
- [Language coverage] Indonesian slang evolves → keep patterns short and add fixtures from real feedback before expanding them.
