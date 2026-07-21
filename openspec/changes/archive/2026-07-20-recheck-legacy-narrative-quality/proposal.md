## Why

Quality checks run during new generation, but old drafts already stored with empty reviewer notes could still display an approval control. The manual-approval boundary must apply the same current rules to every draft.

## What Changes

- Recompute deterministic review notes when drafts are listed, without writing or changing draft content.
- Recompute the same notes immediately before approval as a server-side guard.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `narrative-studio-ui`: Previously stored drafts with current blocking quality failures appear blocked and cannot be approved.

## Impact

Updates `NarrativesService` read/approval paths and a focused service test. No migration, model call, raw-content storage, API shape change, or dependency is required.
