## Why

V1 can generate and review narratives, but its feedback stops at a human note: approved drafts cannot be published through the official Threads flow, review outcomes do not become reusable DNA, and there is no safe record of outcomes or learning runs. Completing this bounded loop now gives V1 a usable manual workflow while keeping automation and platform risk behind explicit approval.

## What Changes

- Add manual publish for approved text narratives through the official Threads API.
- Capture structured reviewer feedback by dimension and turn explicitly approved feedback into diagnosis-first knowledge metadata.
- Record manual views, clicks, likes, replies, reposts, and quotes with derived CTR and engagement rates.
- Add a small pending-learning runner plus an opt-in in-process daily scheduler; no durable queue or automatic publishing.
- Extend personas with thinking and observation guidance, and pass that guidance into generation and review.
- Keep reviewer guards contextual: feedback and DNA expand diagnostics without making one vocabulary list or reasoning sequence mandatory.
- Keep all new controls manual, auditable, and reversible; raw source threads are never stored.

## Capabilities

### New Capabilities

- `feedback-learning`: structured feedback, approved DNA extraction, and bounded learning runs.
- `narrative-analytics`: manual metric capture and CTR/engagement summaries.
- `threads-publishing`: approved text-only manual publishing through Threads.
- `persona-engine`: persist thinking and observation guidance alongside vocabulary.

### Modified Capabilities

- `narrative-authenticity-review`: include persona thinking style and feedback dimensions in diagnosis.
- `knowledge-engine`: persist diagnosis-first lessons created from approved feedback.
- `threads-connection`: preserve the connection-only boundary while adding an explicitly approved publish action.

## Impact

Adds small NestJS modules, Mongo metadata schemas, API endpoints, and compact Tailwind controls to the existing dashboard. It reuses the current Threads connection, AiOrchestratorService, KnowledgeService, and approval queue. No new dependency, external scheduler, auto-publish path, or breaking API is introduced; publishing remains blocked unless a narrative is approved and a valid encrypted Threads connection exists.
