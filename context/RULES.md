# Engineering Rules

## Required constraints

1. A source-code file must contain at most 200 lines. Split by responsibility before it crosses the limit. `npm run check:lines` enforces this.
2. Every LLM request goes through `AiOrchestratorService`; no exception.
3. Validate user input at API boundaries and keep automatic publishing behind explicit approval.
4. Do not store a raw imported thread. Persist only extracted pattern metadata.
5. Avoid sales CTAs. A link is a contextual reference.
6. Generate embeddings only through `AiOrchestratorService`; Qdrant stores vector IDs and Mongo knowledge IDs, never raw sources.
7. Keep one embedding model per Qdrant collection. Create a new collection and reindex when vector dimensions change.
8. Crawling is manual in V1: obey robots.txt, reject non-public targets, bound domain/rate/size/page count, and never retain raw fetched content or Nutch artifacts.

## OpenSpec workflow

For a meaningful feature, behavior change, or architecture change:

1. Create an OpenSpec change with a concise proposal, design, specs, and tasks.
2. Implement only approved tasks and tick them as they finish.
3. Sync the accepted delta specs into `openspec/specs/`.
4. Archive the completed change.

Use the project-local `.codex/skills/openspec-*` skills. Project context lives in this directory.

## Ponytail workflow

Use the first solution that is both safe and sufficient: reuse local code, then standard library, native browser/platform capability, installed dependencies, and finally new code. Do not add a dependency or abstraction for a single use.

If a deliberate shortcut has a known ceiling, add a `ponytail:` comment with the upgrade condition.

## Verification

Run these before handing off implementation:

```text
npm run check:lines
npm test
npm run build
```

## Code shape

- One clear responsibility per file.
- Prefer named data types and small pure helpers.
- Keep components accessible: labels, keyboard-safe controls, and text status.
- Do not edit generated OpenSpec skill files.
- Treat `vectorStatus: pending` as recoverable; reindex rather than asking a creator to resubmit a source.
