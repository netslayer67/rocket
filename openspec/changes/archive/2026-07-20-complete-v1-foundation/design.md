## Context

The backend already supports V1 data flow, while the web page is one client component close to its size limit. This change adds project governance and turns the page into a small Tailwind studio without changing API contracts, persistence, or the manual-approval boundary.

## Goals / Non-Goals

**Goals:**

- Keep code files below 200 lines with a runnable repository check.
- Make future changes traceable through OpenSpec, contextual docs, and Ponytail rules.
- Present V1 as a clear, accessible, responsive workflow.

**Non-Goals:**

- Add a UI component library, state library, endpoint, or database migration.
- Change AI prompts, retrieval, authentication, or publication behavior.

## Decisions

### Use local documentation and a Node check

`context/` is lightweight, versionable, and discoverable by both people and agents. A small Node script walks only project source roots and avoids another lint plugin. An ESLint maximum-lines rule was rejected because ESLint is not otherwise used and would add configuration plus a dependency for one invariant.

### Keep OpenSpec project-local and Ponytail instruction-only

OpenSpec generates Codex skills and stores artifacts under `openspec/`. Ponytail is already the active Codex plugin, so `AGENTS.md`, OpenSpec context, and `context/RULES.md` make its constraints visible in the repository without adding a runtime package.

### Split UI by user workflow

The dashboard owns data fetching and feedback. Persona, knowledge, generator, review queue, and layout components receive only the data and callbacks they need. This keeps files small and avoids global state; a store library is unnecessary for one page.

### Reuse Tailwind primitives

Global Tailwind component classes define buttons, fields, and cards. Components compose classes rather than introducing shadcn/ui or a custom token layer. This is sufficient for V1 and preserves visual consistency.

## Risks / Trade-offs

- [More small UI files] → Components follow the actual creator workflow and remain local to `apps/web`.
- [Line script is not a complexity metric] → It enforces only the explicit hard limit; review still checks responsibilities.
- [OpenSpec adds Markdown] → Use it for behavior changes, not trivial copy edits.
- [No third-party icons] → Text-first UI remains accessible and avoids an unnecessary dependency.
