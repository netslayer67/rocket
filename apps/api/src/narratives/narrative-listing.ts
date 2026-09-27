import type { Narrative } from './schemas/narrative.schema';
import { diagnoseReviewNotes } from './narrative-diagnostics';
import { reviewNarrative } from './narrative-review';
import { evaluateDraftQuality } from './draft-quality';
import { sequenceText } from './narrative-sequence';
import { reviewSequence } from './sequence-review';

type Listed = Pick<Narrative, 'topic' | 'title' | 'body' | 'referenceTitle' | 'referenceUrl' | 'references' | 'sequence' | 'reviewerNotes' | 'quality' | 'retrieval'>;

export function reviewNotesForNarrative(narrative: Listed) {
  const body = sequenceText(narrative.sequence) || narrative.body;
  return [...new Set([...(narrative.reviewerNotes ?? []), ...reviewNarrative(narrative.title, body, {
    topic: narrative.topic, referenceTitle: narrative.referenceTitle, referenceUrl: narrative.referenceUrl,
  }), ...reviewSequence(narrative.sequence, narrative.references ?? [])])];
}

export function listedNarrative(narrative: Listed) {
  const reviewerNotes = reviewNotesForNarrative(narrative);
  return { ...narrative, reviewerNotes, reviewerDiagnostics: diagnoseReviewNotes(reviewerNotes), quality: narrative.quality ?? evaluateDraftQuality(reviewerNotes) };
}
