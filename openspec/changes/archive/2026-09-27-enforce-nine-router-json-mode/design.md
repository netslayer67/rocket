## Context

The 9Router route already uses `stream:false`, but its Gemini model still produces prose for requests where Rocket requires a JSON object. Production telemetry records successful provider calls with `invalid-output`; the raw content remains intentionally unavailable.

## Goals / Non-Goals

**Goals:**
- Send OpenAI-compatible `response_format: { type: "json_object" }` only when a configured 9Router request asks for JSON.
- Preserve the output parser as a defensive boundary if the provider ignores or rejects the mode.

**Non-Goals:**
- Changing OpenRouter persona compatibility, weakening output gates, adding a repair model call, or logging model text.

## Decisions

- Reuse the existing `request.json` flag and add the format only when the resolved route is 9Router. The provider advertises an OpenAI-compatible endpoint; structured mode is the smallest enforceable contract.
- Keep the prior omission for OpenRouter persona models because named free providers have varied support.
- Treat a provider rejection as the existing safe bounded fallback failure; no automatic paid route is added.

## Risks / Trade-offs

- [A 9Router model rejects JSON mode] → The safe `http-400` rejection exposes an incompatible model rather than accepting prose; configure a compatible fallback.
- [A provider ignores JSON mode] → Existing parsing and quality gates continue to reject invalid output without storing it.
