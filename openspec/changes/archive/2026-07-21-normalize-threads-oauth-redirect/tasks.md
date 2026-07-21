## 1. API redirect hardening

- [x] 1.1 Normalize `WEB_ORIGIN` in `ThreadsController.dashboardUrl` before constructing the redirect URL.
- [x] 1.2 Add a controller regression test for whitespace-padded origins on callback redirects.

## 2. Verification and release

- [x] 2.1 Run `npm run check:lines` and `npm test`.
- [x] 2.2 Run `npm run build` and deploy the API production target.
- [x] 2.3 Verify the callback route no longer returns an invalid-header 500 and archive the OpenSpec change.
