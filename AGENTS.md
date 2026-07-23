# Rocket Project Agent Guide

Read [context/RULES.md](context/RULES.md) before changing code. Read the relevant context document before changing product behavior, design, architecture, operations, or data.

For frontend work, read [context/AI-SLOP.md](context/AI-SLOP.md) and record its review before accepting a material UI change. Do not edit generated skill files; project-specific Ponytail guidance belongs in context and AGENTS rules.

For meaningful changes, use OpenSpec: propose → apply → sync → archive. The local Codex OpenSpec skills are in `.codex/skills/`.

Ponytail is active: reuse existing code and dependencies, prefer the smallest safe change, and do not add speculative abstractions.

No source-code file may exceed 200 lines. Split by responsibility before crossing the limit. Keep raw source data out of MongoDB, Qdrant, and logs. Run `npm run check:lines`, `npm test`, and `npm run build` before handoff.

Narrative DNA is diagnosis-first: record why a pattern works or fails, its root cause, fix, dimensions, and evidence provenance. Do not turn persona vocabulary into a standalone blacklist or make one reasoning sequence mandatory. Meaningful reviewer/learning changes must include positive and negative OpenSpec scenarios plus a Ponytail ceiling for any narrow heuristic.
