## Context

The existing reviewer already detects product injection and marketplace language. This example adds two adjacent failure classes: persona cosplay and unsupported product specification claims.

## Decisions

- Store only an abstract negative lesson with `naturalness: 1`; no raw draft or product facts.
- Add small lexical checks for the exact forced-context and garment-claim classes found in the review.
- Tell the model to follow `Observe -> Wonder -> Hypothesis -> Reference -> Open Question` and use persona vocabulary only when earned by the scene.
- Do not expand the Persona schema yet; a thinking-style field needs a separate product decision and UI work.

## Trade-offs

The lexical checks are intentionally narrow and may miss new wording. Add a new fixture from real feedback before broadening them.
