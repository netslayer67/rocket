# Product Requirements Document — V1 + V2

## Problem

Creators need a way to turn a topic and a useful reference into a natural discussion, without treating the reference as an advertisement. Generic AI writers start from a product and lose audience trust.

## Goal

Help a creator produce a persona-aligned narrative draft that creates curiosity first and presents a link as neutral context.

## Primary user

An Indonesian content creator who writes social threads, newsletters, or posts and wants to review every output before publishing.

## Delivered outcomes

1. Users can define a writing persona.
2. Users can import a source and keep only its reusable narrative pattern.
3. Users can generate a narrative from a topic, persona, and optional reference.
4. Users can see reviewer notes and explicitly approve a draft for manual publishing.
5. Users can work without an OpenRouter key through a clearly local demo response.
6. Users can inspect a library of extracted narrative patterns and their semantic-index state.
7. The system uses semantic retrieval when Qdrant and embeddings are available, with a lexical fallback.
8. Users can connect one Threads account with official OAuth and publish an approved text draft through an explicit manual action.
9. Users can fill an editable reference title and contextual topic suggestion from a public reference URL.
10. An operator can manually import one compliant public page as pattern knowledge or use Nutch to discover candidate URLs without automatic import.
11. A creator sees narrative-generation stages over SSE and receives the saved draft in the review queue without refreshing the page.
12. Reviewers can submit dimension scores and, when explicitly approved, turn feedback into reusable diagnosis-first DNA.
13. Operators can capture manual views/clicks/engagement and see derived CTR and engagement rates.
14. An opt-in daily learning tick and a manual learning run process approved feedback without publishing.

## Functional requirements

| Capability | Requirement |
| --- | --- |
| Persona | Store tone, vocabulary, sentence length, emoji habit, interaction style, and optional thinking/observation guidance. |
| Knowledge | Extract hook, emotion, conflict, information gap, discussion, authority, CTA, naturalness, and pattern summary. |
| Retrieval | Embed compact metadata, merge bounded semantic matches from Qdrant with lexical matches, then use recent patterns as a safe fallback. |
| Narrative | Retrieve relevant patterns and generate a JSON draft through the orchestrator. |
| Generation progress | Return a job ID, stream bounded server progress over SSE, persist the draft, then emit completion with the saved draft. |
| Reference suggestion | Read transient public-link metadata and suggest an editable, broader discussion angle without inventing claims. |
| Review | Flag generic AI patterns, article-style hooks, missing persona voice, missing contextual link bridges, observed incompatible concrete scenes, and obvious hard-selling phrases. |
| Approval | Keep the draft unpublished until a user marks it approved. |
| Threads publishing | Publish one approved text narrative through the official Threads API only after explicit operator action. |
| Feedback learning | Store structured reviewer dimensions and create compact DNA only when approved for learning. |
| Analytics | Capture manual metrics and derive CTR and engagement; label the source as manual. |
| Crawl discovery | Crawl only a creator-approved public page with robots, domain, size, delay, and page limits; Nutch only discovers manually reviewed candidate URLs. |
| Observability | Store model choice, cache hit, demo mode, reported token usage, and bounded retrieval mode/IDs without prompts or source text. |

## Non-goals

- Automatic social-platform publishing, scraping, or crawling.
- Automated comment replies, scheduling, or analytics ingestion.
- Fine-tuning, multi-user auth, or billing.
- Durable scheduled jobs, platform analytics ingestion, and reply monitoring.

## Success signal

A creator can complete persona → import → generate → review → approve in one dashboard session, with no promotional CTA introduced by the system.
