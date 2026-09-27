# Content Sequence Planning

## Purpose

Generate reviewable conversation-shaped content plans with contextual references while preserving manual approval and the V1 main-post publisher boundary.

## Requirements

### Requirement: Reviewable conversation-shaped content sequence
The system SHALL generate and persist a compact optional sequence consisting of one main post and zero to three replies. Every segment SHALL state its role and objective, while the existing title, body, and link-placement fields SHALL remain the main-post compatibility surface. A sequence SHALL be guidance, not a mandatory narrative template.

#### Scenario: Generator returns a multi-post plan
- **WHEN** a valid model response includes a main post and replies
- **THEN** the saved draft retains their order, roles, objectives, and text for human review

#### Scenario: Free model returns a legacy valid narrative
- **WHEN** a model response contains valid title, body, and link placement but no sequence
- **THEN** the system saves a one-post sequence derived from that narrative instead of rejecting usable output

### Requirement: Contextual reference placement
The system SHALL accept at most five creator-provided HTTP(S) references and SHALL allow a generated link only when it matches a supplied URL, declares an intent, and has a contextual anchor present in the same segment. Supported intents SHALL include resource, identifier, recommendation, reference, alternative, action, and answer. The system SHALL NOT treat a fixed final CTA as the default placement rule.

#### Scenario: Recipe-style supporting links
- **WHEN** a sequence includes several supplied product references in a utility reply
- **THEN** each link is retained with its nearby item anchor and supporting or hero role for review

#### Scenario: Detached or unknown link
- **WHEN** a generated sequence contains a bare, unknown, or unanchored URL
- **THEN** deterministic review records a blocking warning and approval remains unavailable

### Requirement: Creator-supplied media brief
The system SHALL optionally generate a concise media brief with a narrative role such as result context, product identification, or use case. The brief SHALL state that the creator must supply and verify the asset; it SHALL NOT claim that unavailable media proves a result.

#### Scenario: Sequence benefits from a visual
- **WHEN** a generated sequence needs an image or short video to make its context clear
- **THEN** the review draft shows a concise creator-supplied media brief without uploading, generating, or publishing media

### Requirement: Claim-risk review
The reviewer SHALL evaluate the combined sequence text in addition to the main post. A high-risk health, safety, legal, or reputation allegation without verified evidence SHALL be a blocking manual-review warning and SHALL NOT become a reusable persuasion pattern.

#### Scenario: High-risk warning style sequence
- **WHEN** a sequence makes an allegation about a clinic, treatment, safety, fraud, or similar harm
- **THEN** the draft is blocked for manual rewrite and the UI explains that a supplied link does not verify the claim
