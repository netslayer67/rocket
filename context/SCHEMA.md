# Data Schema

MongoDB is the V2 source of truth. Mongoose schemas define the runtime shape; Qdrant holds a derived semantic index.

| Collection | Important fields | Purpose |
| --- | --- | --- |
| `personas` | `name`, `tone`, `vocabulary`, `sentenceLength`, `emojiHabit`, `interactionStyle`, optional `thinkingStyle`, `observationStyle`, `reasoningPatterns` | Defines a consistent creator voice and reasoning guidance. |
| `knowledge` | V1 fields plus `conflict`, `persona`, `style`, `vocabulary`, `informationGap`, `discussionPattern`, `authorityType`, `ctaStyle`, `naturalness`, optional `lessonType`, `diagnosis`, `rootCause`, `recommendedFix`, `failureDimensions`, `evidenceSources`, `vectorStatus`, `embeddingModel` | Stores diagnosis-rich narrative DNA, never raw source text. |
| `narratives` | `topic`, `personaId`, `referenceTitle`, `referenceUrl`, `title`, `body`, `linkPlacement`, `reviewerNotes`, `status`, optional `publishedThreadId`, `publishedAt` | Stores reviewable output and manual publication result. |
| `jobs` | `jobId`, `payload`, ordered compact `events`, optional `startedAt`, `completedAt` | Shares bounded narrative-generation progress across serverless API instances; never stores raw imported source text or credentials. |
| `airuns` | `task`, `model`, `inputHash`, `cached`, `demo`, `inputTokens`, `outputTokens` | Records AI routing and usage decisions. |
| `threadsconnections` | `key`, `accountId`, encrypted token fields, `expiresAt`, `connectedAt` | Stores one OAuth connection; no email, password, or plaintext token. |
| `feedback` | `narrativeId`, `lessonType`, bounded `scores`, `notes`, `approvedForLearning`, optional `learnedAt`, `knowledgeId` | Stores structured reviewer diagnosis, never imported source text. |
| `learninglogs` | `feedbackId`, `knowledgeId`, `status`, `error` | Makes feedback learning idempotent and observable. |
| `analytics` | `narrativeId`, metric counters, derived `ctr`, `engagementRate`, `capturedAt` | Stores manually captured outcome signals. |

## Relationships

```text
Persona 1 ─── * Narrative
Knowledge * ─── * Narrative generation context (retrieved, not linked)
AiRun * ─── 1 AI task type
Knowledge 1 ─── 1 Qdrant point (derived; payload only contains Mongo knowledge ID)
ThreadsConnection 1 ─── 1 local creator account (V2 single-account boundary)
```

## Indexes

- `knowledge.topics + createdAt` supports the V1 lexical retrieval query.
- `knowledge.vectorStatus + createdAt` identifies records needing reindexing.
- MongoDB creates the default `_id` index for every collection.

## Data retention

Imported `content` is used only while the knowledge extraction request runs. It must not be added to the `knowledge` schema, logs, or error output. Narrative drafts and AI run metadata remain available for manual review and later analytics.

Curated image-derived DNA in `apps/api/data/knowledge-dna.json` contains metadata only. Positive and negative lessons may include diagnosis, root cause, fix, dimensions, and evidence-source labels, but never the source text. Run `npm run seed:knowledge-dna` to upsert it, then reindex so Qdrant receives the same compact metadata representation.

Reference preview HTML and metadata are transient request input. They are never persisted; only a creator-selected `referenceTitle`, `referenceUrl`, and generated narrative draft may be stored.

Crawler HTML and cleaned page text are also transient request input to the existing knowledge import contract. Scrapy creates no database records of its own, and Nutch candidate discovery uses a deleted-on-exit temporary work directory. Only the resulting extracted knowledge metadata and vector may remain.

Qdrant vectors are generated from the compact metadata fields. Changing `OPENROUTER_EMBEDDING_MODEL` requires reindexing into a compatible collection.

Threads token fields are AES-256-GCM ciphertext, IV, and authentication tag. Changing `THREADS_TOKEN_ENCRYPTION_KEY` requires disconnecting and reconnecting the account.
