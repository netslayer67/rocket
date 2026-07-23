## 1. Threads publish boundary

- [x] 1.1 Add safe token decryption and text-only create-container/publish calls using the existing encrypted connection.
- [x] 1.2 Add approved-only narrative publish endpoint and publication metadata with focused service tests.

## 2. Feedback learning

- [x] 2.1 Add feedback and learning-log schemas, DTO validation, service, and manual endpoints.
- [x] 2.2 Convert approved feedback to diagnosis-first Knowledge metadata and reindex idempotently.
- [x] 2.3 Add the bounded daily in-process learning tick with a Ponytail upgrade ceiling.

## 3. Analytics

- [x] 3.1 Add manual metric schema, DTO, derived CTR/engagement calculations, and endpoints.
- [x] 3.2 Expose a compact dashboard summary and cover zero-view behavior with tests.

## 4. Persona and reviewer context

- [x] 4.1 Add optional thinking-style fields to persona validation, storage, and generation context.
- [x] 4.2 Extend reviewer feedback dimensions without adding vocabulary blacklists or mandatory flow templates.

## 5. Dashboard workflow

- [x] 5.1 Add publish state/action, feedback capture, analytics summary, and learning-run status using existing Tailwind primitives.
- [x] 5.2 Record the UI review against the anti-slop checklist and verify narrow layout, keyboard labels, focus, and reduced motion.

## 6. Verification and handoff

- [x] 6.1 Sync accepted delta specs into main specs and validate OpenSpec artifacts.
- [x] 6.2 Run `npm run check:lines`, `npm test`, and `npm run build`.
