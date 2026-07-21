## 1. Scrapy importer

- [x] 1.1 Add a standalone Scrapy project with safe public-seed validation and bounded transient page extraction.
- [x] 1.2 Configure robots compliance, named user agent, throttling, domain concurrency, response limits, and explicit page cap.
- [x] 1.3 Submit successful text through the existing knowledge-import API without adding a direct LLM or persistence path.
- [x] 1.4 Add focused crawler tests for public-target validation.

## 2. Nutch discovery

- [x] 2.1 Add an operator-only Nutch discovery adapter that uses a temporary workspace and same-domain filter.
- [x] 2.2 Document required Nutch runtime setup and the explicit manual discovery/import boundary.

## 3. Project contracts and verification

- [x] 3.1 Add crawler configuration examples and ignore local crawler artifacts.
- [x] 3.2 Update product, architecture, schema, rules, and root documentation for compliant crawling.
- [x] 3.3 Run crawler tests, line-limit checks, API tests, and workspace build.
