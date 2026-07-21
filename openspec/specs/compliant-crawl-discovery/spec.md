# compliant-crawl-discovery Specification

## Purpose
TBD - created by archiving change add-compliant-crawl-discovery. Update Purpose after archive.
## Requirements
### Requirement: Explicit compliant page import
The system SHALL provide a manual Scrapy command that crawls an explicitly supplied public HTTP(S) seed and submits transient, bounded page text to the existing knowledge-import API.

#### Scenario: Approved public page is imported
- **WHEN** an operator runs the crawler with a valid public seed and a reachable API
- **THEN** it submits the page through the existing knowledge-import contract and the API persists only extracted pattern metadata

#### Scenario: Unsafe seed is supplied
- **WHEN** an operator supplies a loopback, private, reserved, malformed, or non-HTTP(S) seed
- **THEN** the crawler rejects the request before fetching content

### Requirement: Polite bounded crawling
The crawler SHALL obey robots.txt, use a named user agent, restrict requests to the seed domain, limit concurrency to one request per domain, use throttling and delay, and enforce configurable page, response-size, and timeout limits.

#### Scenario: Crawl limit is reached
- **WHEN** the operator requests more than one same-domain page and the configured page cap is reached
- **THEN** the crawler stops scheduling pages beyond that cap

### Requirement: Manual Nutch candidate discovery
The system SHALL provide an optional operator-run Apache Nutch adapter that accepts one public seed, applies a same-domain URL filter, writes crawl artifacts only to a temporary directory, and outputs candidate URLs without importing or publishing them.

#### Scenario: Discovery completes
- **WHEN** an operator runs the Nutch adapter with a prepared Nutch runtime and valid public seed
- **THEN** it prints same-domain candidate URLs and removes its temporary crawl directory when the command exits

### Requirement: No automated crawler execution
The system SHALL NOT expose crawler or Nutch execution through the dashboard or API in V1.

#### Scenario: Creator uses the dashboard
- **WHEN** a creator uses the V1 dashboard
- **THEN** no control can launch a crawler, import a discovered URL, or publish a result automatically

