## 1. Queue state

- [x] 1.1 Apply the confirmed narrative response directly to the web queue.
- [x] 1.2 Prevent stale refresh responses from overwriting newer state.
- [x] 1.3 Confirm no web test harness exists; use the existing full build/type-check as the regression check.

## 2. Documentation and release

- [x] 2.1 Sync the queue reliability and UI delta specs into main specs.
- [ ] 2.2 Run `npm run check:lines`, `npm test`, and `npm run build`.
- [ ] 2.3 Commit, push, deploy the web app, verify the production queue, and archive this change.
