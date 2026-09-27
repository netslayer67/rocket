## Context

Interactive 9Router chat uses the existing persona prompt and output gate. Gemini can return the requested JSON object inside a Markdown fence or with a short presentation wrapper, but the current parsers call `JSON.parse` on the whole response. The result is a safe `invalid-output` rejection even when the object itself has the required fields.

## Goals / Non-Goals

**Goals:**
- Parse one JSON object from a fenced or wrapped model response before current field and quality validation.
- Reuse the same normalizer for narrative and reference-angle structured responses.
- Preserve bounded fallback, compact telemetry, and manual review.

**Non-Goals:**
- Changing prompts, accepting missing narrative fields, repairing invented claims, preserving raw outputs, or changing model providers.

## Decisions

- Add one small pure parser in `apps/api/src/narratives` that first tries the trimmed response, then a fenced body, then the first complete object span. Existing domain parsers retain responsibility for required fields and grounded content.
- Do not use a model retry or an additional LLM call to repair syntax. The parser is deterministic, free, and bounded.
- Keep rejected output unpersisted and unlogged. The existing orchestrator records only the safe rejection code.

## Risks / Trade-offs

- [A wrapper contains unrelated braces] → The extracted object must still pass the existing narrative/reference field and quality gates.
- [Malformed JSON] → Parsing still throws and returns `invalid-output`; no fallback is silently accepted.
- [Provider response shape changes] → This only normalizes message text; transport and model routing remain unchanged.
