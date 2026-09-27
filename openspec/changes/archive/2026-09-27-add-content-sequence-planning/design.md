## Context

`apps/api` currently persists one narrative body and one optional reference. `apps/web` renders that body as a single review card. This keeps the V1 manual text publisher simple, but it cannot represent a Threads-shaped conversation in which attention, value, commerce, and engagement have different jobs. The existing `AiOrchestratorService`, transient reference preview, deterministic reviewer, Mongoose draft schema, and Tailwind studio components are the only building blocks required.

## Goals / Non-Goals

**Goals:**

- Persist a compact sequence plan with a main post, up to three replies, contextual links, and an optional media brief.
- Accept up to five creator-provided references, retaining titles/URLs only.
- Keep the legacy title/body/link placement as the main-post compatibility surface for existing jobs and V1 text publishing.
- Review all generated segments and link anchors before manual approval.
- Render the plan as readable text sections using existing studio primitives.

**Non-Goals:**

- No general web search, social scraping, crawler launch, source-body persistence, media upload, reply publishing, or automatic publishing.
- No claim that a brief is visual proof; media remains creator-supplied and reviewable.

## Decisions

1. **Optional compact `sequence` object on `Narrative`.** It stores only generated post text, supplied URLs/titles, link intent/anchor/role, and a short media brief. This preserves existing documents and top-level publication. A separate collection or queue would be premature for one draft flow.
2. **One DTO with backward-compatible primary reference plus `references`.** The first supplied reference remains the legacy `referenceTitle`/`referenceUrl`; the UI supplies up to five references. This avoids breaking old clients and enables recipe-style contextual links.
3. **One structured model response, lenient fallback.** The prompt asks for a sequence JSON shape. If a free model returns a valid legacy narrative, parsing builds a one-post sequence rather than discarding a usable draft. Invalid JSON still follows bounded model routing.
4. **Reuse the deterministic reviewer.** The service passes the joined sequence text to the existing reviewer and adds small structural checks: supplied URL only, non-empty anchor present in its post, and a high-risk allegation is blocked for manual rewrite. `ponytail:` this narrow risk rule must be replaced by evidence-type classification only after reviewed examples establish a stable taxonomy.
5. **No publisher expansion.** The existing official publisher continues to send only `body` (the main post). The UI labels this plainly and asks the creator to copy approved replies manually.

## Risks / Trade-offs

- **Free model omits the new structure** → parse a valid legacy body into a one-post plan and keep review visible.
- **Multiple URLs invite detached promotion** → anchors must exist beside their link and the reviewer blocks bare/unknown URLs.
- **High-risk topics look persuasive without evidence** → block them from approval; do not infer truth from a supplied URL.
- **Long sequence cards overwhelm phones** → collapse no content, but use a vertical ordered list with wrapping text and no nested dashboard cards.

## Migration Plan

Deploy additive DTO/schema fields first. Existing narratives render through their top-level fields. Rollback is safe because the publisher and legacy list response continue using top-level fields; new `sequence` fields are ignored by prior versions.

## Open Questions

- External discovery/cache, provider permissions, and fresh-source provenance need their own approved change before research can feed this plan.
- Official Threads support for replies and media must be verified before any publish automation is proposed.
