# Narrative Coherence

## Purpose

Keep each generated thread inside one believable scene and make concrete observations causally understandable.

## Requirements

### Requirement: Scene and object consistency gate
The reviewer SHALL block a draft when high-confidence activity, environment, or object groups conflict without an explicit comparison or transition bridge.

#### Scenario: Kite scene drifts into basketball equipment
- **WHEN** a draft mentions kite-flying and then an unexplained basketball shoe, foam, or indoor floor
- **THEN** the reviewer records a blocking context-drift warning and sends it to the one-time rewrite path

#### Scenario: Deliberate comparison is explained
- **WHEN** a draft mentions two scene groups with a cue such as “mirip”, “analogi”, or “bandingkan”
- **THEN** the reviewer does not block solely for the scene-group overlap

### Requirement: Concrete observation gate
The reviewer SHALL flag abstract metaphors, generic adjectives, unexplained object claims, and promotional transitions that replace a specific personal observation.

#### Scenario: Abstract shoe description is generated
- **WHEN** a draft says an object “menambahkan dimensi visual”, feels “dramatis”, or “punya rahasia tersendiri” without a concrete action or sensation
- **THEN** the reviewer records an AI-smell warning and blocks approval

### Requirement: Process-of-thought cue
The reviewer SHALL require either a concrete first-person observation or a visible uncertainty/process cue before accepting a conversational draft.

#### Scenario: Draft reaches a polished conclusion too quickly
- **WHEN** the body has no first-person observation and no cue such as “awalnya”, “gw kira”, “jangan-jangan”, “belum yakin”, or “baru kepikiran”
- **THEN** the reviewer records a blocking human-thinking warning
