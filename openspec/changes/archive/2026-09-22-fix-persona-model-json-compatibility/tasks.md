## 1. Request compatibility

- [x] 1.1 Omit the provider JSON-format option only for active-persona free-model requests while retaining existing prompt and gate behavior.
- [x] 1.2 Add regression coverage proving persona requests omit that option and other structured requests retain it.

## 2. Failure clarity

- [x] 2.1 Emit an incomplete progress value for a failed narrative job and cover its SSE event.
- [x] 2.2 Preserve a server-reported failed progress value in the Studio and record the required UI review.

## 3. Verification and specification completion

- [x] 3.1 Run line-limit, focused regression, full test, and production build checks.
- [x] 3.2 Sync the approved delta specifications and archive the completed OpenSpec change.
