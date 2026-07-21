## Context

Curated DNA already supports positive patterns and the reviewer already blocks the failure modes found in this draft. The missing piece is a retrievable negative lesson for the generator's context.

## Decisions

- Add one compact record with `naturalness: 1` and `narrativeType: negative reviewer lesson`.
- Use only abstracted failure metadata: product injection, marketplace wording, unsupported topic drift, weak discussion, and missing human branch.
- Keep the source label stable so the idempotent seed updates it instead of duplicating it.

## Trade-offs

The lesson is lexical and structural rather than a full evaluator trace. The existing deterministic reviewer remains the approval gate; this record only improves generation context.
