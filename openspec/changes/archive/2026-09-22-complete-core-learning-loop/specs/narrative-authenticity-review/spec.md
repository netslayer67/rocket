## ADDED Requirements

### Requirement: Explicit stereotype risk detection
The reviewer SHALL flag an explicit universal generalization that reduces a demographic or place-based identity to a trait, while allowing concrete, qualified observations about an individual or context. The check MUST be contextual, narrowly scoped, and must not become a persona-vocabulary blacklist.

#### Scenario: Draft makes a universal identity claim
- **WHEN** a draft claims that all women, all girls, or all people from a named place share a behaviour or preference
- **THEN** the reviewer records a blocking stereotype-risk diagnostic and the quality snapshot reduces its stereotype dimension

#### Scenario: Draft makes a qualified observation
- **WHEN** a draft describes one person's stated preference or a bounded local observation without assigning it to an entire group
- **THEN** the reviewer does not flag stereotype risk solely because an identity or location is mentioned
