## Why

The V2 audit still identifies two concrete gaps after multi-angle discovery: reviewer feedback is stored as opaque notes, and manual analytics never becomes a reviewable learning signal. Without those links, the system can generate and evaluate drafts but cannot explain failures consistently or show which narrative dimensions deserve a future DNA lesson.

## What Changes

- Expose stable reviewer diagnostic codes, dimensions, severity, and messages alongside existing notes.
- Aggregate manual analytics per narrative into outcome candidates with CTR, engagement rate, sample size, and narrative context.
- Show candidates in the existing analytics surface while keeping DNA promotion explicit and human-approved.
- Add regression tests for diagnostic mapping, zero-view rates, grouped outcomes, and missing narratives.

Non-goals: automatic DNA promotion, platform analytics ingestion, scheduler/queue work, publishing changes, model benchmarking, or a new agent/service/dependency layer.

## Capabilities

### New Capabilities

- `review-diagnostics`: Stable, diagnosis-first reviewer output derived from existing checks.
- `outcome-learning-candidates`: Reviewable outcome signals aggregated from operator-entered analytics.

### Modified Capabilities

- `narrative-analytics`: Add a read-only outcome-candidate endpoint and preserve manual source labeling.
- `narrative-authenticity-review`: Expose dimensions without turning a diagnostic into a vocabulary blacklist or mandatory narrative flow.

## Impact

The NestJS analytics and narrative read paths gain small pure helpers and read-only response fields. The Next.js analytics panel renders candidates using existing Tailwind primitives. MongoDB stores no new raw source; candidates are derived from bounded manual rows and are not written as DNA. Existing feedback approval and Threads manual-publish boundaries remain unchanged.
