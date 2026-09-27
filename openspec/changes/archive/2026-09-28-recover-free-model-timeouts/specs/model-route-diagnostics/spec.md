## MODIFIED Requirements

### Requirement: Safe configured-model attempt diagnostics
For every failed configured model candidate, the API SHALL persist a compact model ID, task, accepted=false, and a safe routing outcome code before trying the next configured candidate. It MUST NOT persist or return provider response bodies, prompts, sources, drafts, credentials, request URLs, or error stacks. When every configured persona model fails, the API SHALL return the ordered distinct safe outcome codes from that fallback run while monitoring retains each compact candidate outcome.

#### Scenario: Candidate returns HTTP 404
- **WHEN** a configured persona model returns HTTP 404
- **THEN** its compact model run records `http-404`, the next candidate is attempted, and monitoring can show the failed candidate

#### Scenario: All candidates fail
- **WHEN** every configured persona model fails with one or more safe routing outcome codes
- **THEN** the job returns a safe unavailable-model error that includes the ordered distinct codes and monitoring retains each compact candidate outcome
