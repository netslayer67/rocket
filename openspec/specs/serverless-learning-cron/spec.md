# Serverless Learning Cron

## Purpose

Trigger bounded, authenticated learning from a serverless platform scheduler.

## Requirements

### Requirement: Authenticated scheduled learning
The API SHALL expose a GET cron endpoint that processes only approved pending feedback when called with the configured cron bearer secret.

#### Scenario: Vercel invokes the cron
- **WHEN** `GET /learning/cron` includes `Authorization: Bearer <CRON_SECRET>`
- **THEN** the API runs the existing bounded learning process and returns processed, skipped, and failed counts without publishing content

#### Scenario: Secret is missing or invalid
- **WHEN** the request has no matching configured bearer secret
- **THEN** the API returns unauthorized and does not process feedback

#### Scenario: No pending feedback exists
- **WHEN** an authenticated cron run finds no approved unlearned feedback
- **THEN** the API returns zero processed items and creates no DNA lesson
