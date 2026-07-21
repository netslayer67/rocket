## Why

Public commerce pages such as Shopee often send HTML larger than the bounded preview limit. The current endpoint rejects those pages before reading their title metadata, leaving the dashboard's editable topic and reference-title fields empty.

## What Changes

- Read at most the existing 80 KB preview limit from an otherwise valid public HTML page, even when its declared size is larger.
- Extract transient title and description metadata from that bounded prefix.
- Continue rejecting unsafe hosts, unsupported content, unreadable pages, and redirect-limit failures.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `reference-suggestions`: Large public HTML pages use a safe bounded prefix instead of being rejected solely because their full response exceeds the preview limit.

## Impact

Updates the NestJS reference-preview reader and its small unit test. The API contract, manual-approval boundary, stored data, and dependencies remain unchanged.
