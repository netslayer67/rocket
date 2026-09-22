import type { Narrative } from './schemas/narrative.schema';
import { diagnoseReviewNotes } from './narrative-diagnostics';
import { reviewNarrative } from './narrative-review';
import { evaluateDraftQuality } from './draft-quality';

type Listed = Pick<Narrative, 'topic' | 'title' | 'body' | 'referenceTitle' | 'referenceUrl' | 'reviewerNotes' | 'quality' | 'retrieval'>;

export function reviewNotesForNarrative(narrative: Listed) {
  return [...new Set([...(narrative.reviewerNotes ?? []), ...reviewNarrative(narrative.title, narrative.body, {
    topic: narrative.topic, referenceTitle: narrative.referenceTitle, referenceUrl: narrative.referenceUrl,
  })])];
}

export function listedNarrative(narrative: Listed) {
  const reviewerNotes = reviewNotesForNarrative(narrative);
  return { ...narrative, reviewerNotes, reviewerDiagnostics: diagnoseReviewNotes(reviewerNotes), quality: narrative.quality ?? evaluateDraftQuality(reviewerNotes) };
}
