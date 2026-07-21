## Context

The frontend exposes only a shared `busy` boolean. Backend requests can take several seconds, particularly when an AI model is involved, so disabled buttons alone do not establish that work is progressing.

## Goals / Non-Goals

**Goals:**

- Make active narrative and link-suggestion requests visible at the point of interaction.
- Provide an estimated percentage, stage text, motion-safe progress bar, and clear completion/failure feedback.

**Non-Goals:**

- No fabricated server telemetry, request cancellation, SSE, polling, dependency, or API work.

## Decisions

- Use a small component-local timer that asymptotically stops at 92% while a request remains unresolved. The UI labels it as an estimate and only reaches 100% after the promise resolves.
- Use a pure helper for stage copy and the next percentage so the bounded progression has a unit test.
- Keep controls disabled through the existing `busy` state; no shared progress state is necessary because only this form displays its own actions.

## Risks / Trade-offs

- [Estimated progress differs from server work] → Label it “perkiraan” and do not represent stages as backend facts.
- [Slow request stalls near completion] → Cap at 92% until the real promise settles.
