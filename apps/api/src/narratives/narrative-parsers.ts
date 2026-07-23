import type { Knowledge } from '../knowledge/schemas/knowledge.schema';

export function parseSuggestion(content: string) {
  const value = JSON.parse(content.replace(/^```(?:json)?\s*|\s*```$/g, '')) as { topic?: unknown };
  const topic = String(value.topic ?? '').trim();
  if (!topic) throw new Error('Reference suggestion is incomplete');
  return topic.slice(0, 180);
}

export function demoSuggestion(referenceTitle: string) {
  return `Hal kecil yang bikin orang melihat ${referenceTitle} dari sudut lain`;
}

export function patternContext(pattern: Knowledge) {
  const { sourceLabel, topics, hookType, emotion, narrativeType, curiosityLevel, linkPlacement, patternSummary, conflict, persona, style, vocabulary, informationGap, discussionPattern, authorityType, ctaStyle, naturalness, lessonType, diagnosis, rootCause, recommendedFix, failureDimensions, evidenceSources } = pattern;
  return { sourceLabel, topics, hookType, emotion, narrativeType, curiosityLevel, linkPlacement, patternSummary, conflict, persona, style, vocabulary, informationGap, discussionPattern, authorityType, ctaStyle, naturalness, lessonType, diagnosis, rootCause, recommendedFix, failureDimensions, evidenceSources };
}
