## 1. Project policy

- [x] 1.1 Add the canonical AI-slop catalog and strict thresholds to `context/AI-SLOP.md`.
- [x] 1.2 Link the policy from `context/DESIGN.md`, `context/RULES.md`, and the Ponytail guidance without changing generated skill files.

## 2. OpenSpec contract

- [x] 2.1 Sync the new `ai-slop-guardrails` requirements and the modified `narrative-studio-ui` requirement into main specs.
- [x] 2.2 Archive this documentation-only change after strict validation.

## 3. Verification

- [x] 3.1 Review current `apps/web` screens against the checklist and record any intentional exceptions.
- [x] 3.2 Run `npm run check:lines`, `npm test`, and `npm run build`.
