<div align="center">

<h1>ROCKET</h1>

<p><strong>An AI Narrative Engine for natural, reference-led conversations.</strong></p>

<p>
  <a href="https://rocket-web-five.vercel.app"><strong>Open Studio</strong></a>
  ·
  <a href="https://rocket-production-0b0e.up.railway.app/health"><strong>API status</strong></a>
  ·
  <a href="context/PRD.md"><strong>Product context</strong></a>
</p>

<table>
  <tr>
    <td align="center"><strong>V1</strong><br><progress value="100" max="100"></progress><br>100% complete</td>
    <td align="center"><strong>V2</strong><br><progress value="90" max="100"></progress><br>90% in progress</td>
    <td align="center"><strong>Source files</strong><br><code>&lt; 200 lines</code><br>maintenance guard</td>
  </tr>
</table>

</div>

Rocket starts with a human observation, learns from narrative patterns, and treats a link as context—not as an advertisement. It is designed for creators who care about curiosity, trust, discussion quality, and a recognizable human voice.

<details>
<summary><strong>What Rocket is (and is not)</strong></summary>

Rocket is a modular narrative workspace. It combines persona thinking, pattern DNA, contextual references, review diagnostics, manual feedback, and measured outcomes into one creator-controlled flow.

It is not a generic AI writer, a thread spinner, or a product-first affiliate generator. The product never leads the story; the narrative earns the reference.

</details>

## Blueprint in one view

```mermaid
flowchart LR
  A[Human observation] --> B[Persona voice]
  B --> C[Narrative DNA]
  C --> D[Contextual reference]
  D --> E[Draft via orchestrator]
  E --> F[Review and approval]
  F --> G[Manual publish]
  G --> H[Measured feedback]
  H --> C
```

Every model request passes through the AI Orchestrator. Retrieval is bounded, metadata is preferred over raw source text, and publishing stays behind an explicit approval boundary.

<details>
<summary><strong>Core principles</strong></summary>

<table>
  <tr><th>Principle</th><th>Meaning</th></tr>
  <tr><td>Narrative first</td><td>Start with an insight, tension, or observation—not a product.</td></tr>
  <tr><td>Reference, not CTA</td><td>A link appears because it helps the conversation make sense.</td></tr>
  <tr><td>DNA, not copies</td><td>Store reusable patterns and diagnoses, never raw threads or page bodies.</td></tr>
  <tr><td>Human review</td><td>Approval, publishing, and learning remain visible operator decisions.</td></tr>
  <tr><td>Evidence before confidence</td><td>Claims keep provenance, and manual metrics are never presented as causation.</td></tr>
</table>

</details>

## Scope progress

| Scope | Progress | What is working |
| --- | ---: | --- |
| **V1 · Narrative Engine** | **100%** | Persona workspace, metadata-only DNA import, SSE generation, review gate, manual Threads approval/publish, feedback learning, and manual analytics. |
| **V2 · Knowledge Engine** | **90%** | Hybrid semantic + lexical retrieval, editable multi-angle suggestions, evidence-aware diagnostics, explicit outcome-to-DNA promotion, and richer transient reference metadata. |

<details>
<summary><strong>V1 delivery checklist</strong></summary>

- Persona creation and voice controls
- Knowledge import that extracts patterns instead of storing source text
- Narrative generation with server-sent progress events
- Reviewer gate with manual approval
- Official Threads OAuth and manual publishing
- Feedback learning with explicit approval
- Manual CTR and engagement calculations

</details>

<details>
<summary><strong>V2 delivery checklist</strong></summary>

- Qdrant semantic retrieval with a lexical fallback
- Reference angle suggestions with confidence, reason, and provenance
- Diagnosis-first review output and stable diagnostics
- Reviewable analytics candidates with transparent sample context
- Explicit positive/negative outcome promotion into reusable DNA
- Bounded reference metadata: type, site, author, section, date, price, currency, and canonical URL

</details>

## System shape

```text
Next.js Studio
      │
      ▼
NestJS API ──► AI Orchestrator ──► OpenRouter
      │                 │
      │                 ├── prompt and token controls
      │                 ├── retrieval context
      │                 └── response validation
      │
      ├── MongoDB  (narrative and knowledge metadata)
      ├── Qdrant   (derived semantic index)
      └── Threads  (official OAuth and approved publishing)
```

The dashboard is built with Next.js, TypeScript, and Tailwind CSS. The API is NestJS-based, with MongoDB as the metadata source of truth and Qdrant as a derived index.

## Quick start

1. Copy `apps/api/.env.example` to `apps/api/.env` and add the credentials required for your environment.
2. Start local services: `docker compose up -d`.
3. Install dependencies: `npm install`.
4. Start the API: `npm run dev:api`.
5. In another terminal, start the web app: `npm run dev`.
6. Open `http://localhost:3000`.

Local endpoints: web `http://localhost:3000` · API `http://localhost:4000`.

## Production

- Web: [rocket-web-five.vercel.app](https://rocket-web-five.vercel.app)
- API: [rocket-production-0b0e.up.railway.app](https://rocket-production-0b0e.up.railway.app)

Server-only production secrets are managed by Railway; Vercel receives only the public API origin. Never commit `.env` files, access tokens, app secrets, encryption keys, or private source material.

Vercel project `rocket-web` must use root directory `apps/web` and the **Next.js** framework preset. Root `.` with **Other** builds the monorepo but fails looking for a `public` output directory. GitHub pushes should deploy the web workspace with its default Next.js output; CLI deployments must include the repository layout matching this root setting.

## Railway API for continuous learning

The repository includes [Railway configuration](railway.json) for one persistent `@rocket/api` service. Approved feedback is still converted immediately; the optional legacy timer checks its backlog. The autonomous internal worker additionally checks approved feedback, non-autonomous DNA and approved narratives every five minutes, independent of dashboard traffic. It synthesizes one diagnosis, checks it with a second model call, and saves accepted metadata with provenance for later retrieval.

Autonomous learning defaults on Railway only. `AUTONOMOUS_LEARNING_ENABLED=false` disables it; explicit `true` enables it elsewhere for controlled testing. Only free OpenRouter models are allowed, including fallback and embeddings. Four attempts per UTC day, two per batch per day and a fifteen-minute failure delay protect quotas. Successfully processed or rejected unchanged batches are not repeated, and autonomous DNA does not feed itself. Inputs are limited to six recent items per source type, not the entire corpus. This is model-reviewed knowledge consolidation, not fine-tuning, measured improvement, or a promise of perpetual growth.

Before cutover, connect the repository in Railway, keep **one replica** on a plan that does not sleep the service, and enter the existing server-only API variables in Railway. Do not copy them into the repository. For continuous learning, set:

```text
LEARNING_SCHEDULER_ENABLED=true
LEARNING_INTERVAL_MS=60000
AUTONOMOUS_LEARNING_ENABLED=true
AUTONOMOUS_LEARNING_INTERVAL_MS=300000
WEB_ORIGIN=https://rocket-web-five.vercel.app
CORS_ORIGINS=https://rocket-web-five.vercel.app
```

After deployment, verify `GET /health` and `GET /monitoring/history`. Health alone does not prove learning is running: inspect `learning.enabled`, `lastCheck`, `nextCheck`, `phase`, `reason` and `latest`. The monitoring page shows these separately from connection heartbeats. `complete` means one reviewed lesson was saved; `waiting` can legitimately mean no new approved evidence. A pending semantic index still permits lexical retrieval. Model/provider errors do not trigger paid fallback, demo DNA or publishing.

Vercel's `NEXT_PUBLIC_API_URL` must be `https://rocket-production-0b0e.up.railway.app` **without** `/api`. Railway's `THREADS_REDIRECT_URI` and Meta's registered callback must both use `https://rocket-production-0b0e.up.railway.app/threads/callback`.

To roll back autonomous execution, set `AUTONOMOUS_LEARNING_ENABLED=false`; persisted DNA and existing manual workflows remain intact. Do not increase worker replicas without distributed leasing and quota protection. Manual analytics promotion and publishing still require explicit approval, and no autonomous crawling is enabled.

## Knowledge and reference safety

Knowledge records contain narrative DNA: hooks, emotions, conflict, information gaps, discussion patterns, diagnoses, root causes, fixes, dimensions, and evidence provenance. Qdrant stores only the derived vector representation.

Reference previews are bounded and transient. When available, Rocket can use structured metadata in the orchestrator context without retaining the fetched page body.

Use **Reindex semantic search** after adding or changing DNA, or call:

```text
POST /knowledge/reindex
```

## Optional tooling

- [Manual crawler](apps/crawler/README.md): compliant Scrapy import and same-domain Nutch discovery.
- `npm run seed:knowledge-dna`: add the reviewed metadata-only fixture, then reindex Qdrant.
- Threads connection uses the official OAuth flow; Rocket never accepts a Threads password.

## Engineering guardrails

Read [AGENTS.md](AGENTS.md) and [context/RULES.md](context/RULES.md) before meaningful changes. OpenSpec documents behavior changes, while Ponytail keeps the implementation small and observable.

```text
npm run check:lines
npm test
npm run build
```

Project context: [PRD](context/PRD.md) · [Architecture](context/ARCHITECTURE.md) · [Design](context/DESIGN.md) · [Schema](context/SCHEMA.md) · [AI-Slop rules](context/AI-SLOP.md) · [V2 audit](context/V2-AUDIT.md)
