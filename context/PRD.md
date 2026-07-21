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
8. Users can connect one Threads account with official OAuth before any future manual publishing.
9. Users can fill an editable reference title and contextual topic suggestion from a public reference URL.
10. An operator can manually import one compliant public page as pattern knowledge or use Nutch to discover candidate URLs without automatic import.

## Functional requirements

| Capability | Requirement |
| --- | --- |
| Persona | Store tone, vocabulary, sentence length, emoji habit, and interaction style. |
| Knowledge | Extract hook, emotion, conflict, information gap, discussion, authority, CTA, naturalness, and pattern summary. |
| Retrieval | Embed compact metadata, retrieve semantic matches from Qdrant, then fall back to lexical matching. |
| Narrative | Retrieve relevant patterns and generate a JSON draft through the orchestrator. |
| Reference suggestion | Read transient public-link metadata and suggest an editable, broader discussion angle without inventing claims. |
| Review | Flag generic AI patterns, article-style hooks, missing persona voice, missing contextual link bridges, observed incompatible concrete scenes, and obvious hard-selling phrases. |
| Approval | Keep the draft unpublished until a user marks it approved. |
| Threads connection | Connect one account using Meta OAuth, encrypt its token, and never publish during connection. |
| Crawl discovery | Crawl only a creator-approved public page with robots, domain, size, delay, and page limits; Nutch only discovers manually reviewed candidate URLs. |
| Observability | Store model choice, cache hit, demo mode, and reported token usage. |

## Non-goals

- Automatic social-platform publishing, scraping, or crawling.
- Automated comment replies, scheduling, or analytics ingestion.
- Fine-tuning, multi-user auth, or billing.
- Scheduled jobs, analytics feedback, platform publishing, and reply monitoring.

## Success signal

A creator can complete persona → import → generate → review → approve in one dashboard session, with no promotional CTA introduced by the system.
