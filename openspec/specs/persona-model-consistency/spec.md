# Persona Model Consistency

## Purpose

Keep one active character recognizable when an interactive request needs a named free-model fallback.

## Requirements

### Requirement: Active-persona voice contract
The system SHALL derive one versioned voice contract from the active persona's identity, tone, thinking style, observation style, claim boundaries, and current interests. Interactive narrative generation, rewrite, and reference-angle suggestion SHALL use that same contract; vocabulary MUST remain contextual guidance rather than a quota, and the contract MUST NOT invent lived experience.

#### Scenario: Multiple models generate for one active persona
- **WHEN** a configured free model produces a narrative, rewrite, or angle for the active persona
- **THEN** it receives the same active-persona voice contract as every other configured persona model

#### Scenario: Archived persona exists
- **WHEN** historical personas remain stored
- **THEN** their character fields cannot be included in a new interactive voice contract

### Requirement: Bounded free persona fallback
The system SHALL select at most four named `:free` persona models from the operator configuration, exclude the dynamic `openrouter/free` router, and use the next model only after a provider, shape, or shared output-gate rejection. Persona-model requests SHALL rely on the versioned voice-contract prompt and shared output gate for JSON validation and MUST NOT require an OpenRouter `response_format` option that a named free provider may not support. It MUST NOT use a paid fallback, modify the autonomous-learning allowlist, or make an unbounded number of model calls.

#### Scenario: First model fails the shared quality gate
- **WHEN** a live narrative response cannot be parsed or has blocking deterministic review diagnostics
- **THEN** the response is rejected without persisting its content and the next configured named free model is attempted

#### Scenario: Candidate list includes an invalid route
- **WHEN** the configured persona list contains `openrouter/free` or a non-free model
- **THEN** that candidate is skipped and no request is sent to it

#### Scenario: A later model passes the gate
- **WHEN** a fallback model returns a valid structured output that passes the shared gate
- **THEN** it becomes the saved draft or suggestion and no later candidate is invoked

#### Scenario: A named free model does not support strict provider JSON
- **WHEN** the active persona request targets a configured named free model that rejects OpenRouter `response_format`
- **THEN** the request omits that provider option, validates the prompt-constrained response through the shared gate, and retains the existing bounded fallback behavior

### Requirement: Compact persona-model audit trail
The system SHALL persist only the task, selected model, accepted state, optional bounded rejection code, token counts, and existing compact metadata for each persona-model attempt. It MUST NOT persist prompts, raw model outputs, source bodies, provider errors, credentials, or generated drafts in AI-run telemetry.

#### Scenario: Model response is rejected
- **WHEN** a response fails its output gate
- **THEN** monitoring can report the model and gate outcome without exposing the rejected text

#### Scenario: Model response is accepted
- **WHEN** a response passes its output gate
- **THEN** monitoring reports the accepted model with its existing compact usage metadata
