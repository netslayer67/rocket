## ADDED Requirements

### Requirement: Approved text publishing
The system SHALL publish only an approved narrative of at most 500 characters with a connected, unexpired Threads token through the official text container and publish endpoints.

#### Scenario: Approved narrative is published
- **WHEN** an operator presses Publish on an approved draft with a valid connection
- **THEN** the API creates a text container, publishes it, stores the returned external ID and time, and returns success

#### Scenario: Draft is not approved
- **WHEN** an operator tries to publish a draft or a blocked review
- **THEN** the API rejects the request and makes no external call

#### Scenario: Threads connection is unavailable
- **WHEN** the token is missing or expired
- **THEN** the API rejects the request with a reconnect instruction and stores no publication result

#### Scenario: Narrative is too long for V1 text publishing
- **WHEN** an approved narrative exceeds 500 characters
- **THEN** the API rejects it before any external call and asks the operator to shorten it

### Requirement: Manual publish visibility
The dashboard SHALL show publication state and SHALL keep publishing as an explicit operator action.

#### Scenario: Operator reviews a published card
- **WHEN** a narrative has a stored publication ID
- **THEN** the queue shows published state and does not offer automatic republishing
