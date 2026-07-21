## Why

Knowledge imports currently require a creator to paste source text. A bounded crawler lets a creator bring selected public pages into the same pattern-learning flow while preserving the existing privacy, quality, and manual-approval rules.

## What Changes

- Add a small Scrapy command-line crawler for a creator-selected public HTTP(S) page and, only when requested, a bounded set of same-domain links.
- Respect `robots.txt`, use a configurable polite delay and one concurrent request per domain, reject local/private targets, and keep fetched content transient.
- Send transient page text to the existing knowledge-import API so its existing extraction, orchestration, and metadata-only persistence rules remain the single ingestion path.
- Add an optional Apache Nutch operator script that discovers a small set of same-domain candidate URLs in a temporary work directory; it does not import or publish anything.
- Document local setup, environment values, source-data retention, and the explicit manual approval boundary.

## Capabilities

### New Capabilities

- `compliant-crawl-discovery`: Manual, bounded public-page crawling and optional candidate URL discovery with politeness and transient-data safeguards.

### Modified Capabilities

- `knowledge-engine`: Allow a compliant crawler to submit transient public-page content through the existing metadata-only knowledge-import flow.

## Impact

Adds a standalone Python Scrapy utility, a manual Nutch shell adapter, crawler environment settings, operational documentation, and crawler tests. It does not add a dashboard control, a new database collection, automated scheduling, publishing, or a direct LLM call.
