import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'node:crypto';
import { Model } from 'mongoose';
import { Knowledge } from '../knowledge/schemas/knowledge.schema';
import { Narrative } from '../narratives/schemas/narrative.schema';
import { Feedback } from './schemas/feedback.schema';

export type InternalEvidence = { id: string; kind: 'feedback' | 'dna' | 'narrative'; data: Record<string, unknown> };
export function evidenceFingerprint(evidence: InternalEvidence[]) {
  return createHash('sha256').update(JSON.stringify({ policy: 3, evidence })).digest('hex');
}
const text = (value: unknown, limit = 700) => String(value ?? '').slice(0, limit);

@Injectable()
export class InternalEvidenceService {
  constructor(
    @InjectModel(Feedback.name) private readonly feedback: Model<Feedback>,
    @InjectModel(Knowledge.name) private readonly knowledge: Model<Knowledge>,
    @InjectModel(Narrative.name) private readonly narratives: Model<Narrative>,
  ) {}

  async collect(): Promise<InternalEvidence[]> {
    // ponytail: latest six per source, not full-corpus coverage; add cursors when older coverage is required.
    const [feedback, dna, narratives] = await Promise.all([
      this.feedback.find({ approvedForLearning: true }).sort({ createdAt: -1, _id: -1 }).limit(6).lean(),
      this.knowledge.find({ origin: { $ne: 'autonomous' }, sourceLabel: { $not: /^Feedback lesson / } })
        .sort({ createdAt: -1, _id: -1 }).limit(6).lean(),
      this.narratives.find({ status: 'approved' }).sort({ createdAt: -1, _id: -1 }).limit(6).lean(),
    ]);
    return [
      ...feedback.map((item): InternalEvidence => ({ id: `feedback:${item._id}`, kind: 'feedback', data: {
        narrativeId: String(item.narrativeId), lessonType: item.lessonType, scores: item.scores, notes: text(item.notes),
      } })),
      ...dna.map((item): InternalEvidence => ({ id: `dna:${item._id}`, kind: 'dna', data: {
        topics: item.topics.slice(0, 6).map((topic) => text(topic, 120)), patternSummary: text(item.patternSummary), lessonType: item.lessonType,
        diagnosis: text(item.diagnosis), rootCause: text(item.rootCause), recommendedFix: text(item.recommendedFix),
        failureDimensions: item.failureDimensions?.slice(0, 8), evidenceSources: item.evidenceSources?.slice(0, 6),
      } })),
      ...narratives.map((item): InternalEvidence => ({ id: `narrative:${item._id}`, kind: 'narrative', data: {
        topic: text(item.topic, 120), title: text(item.title, 200), excerpt: text(item.body, 1200),
        linkPlacement: item.linkPlacement, caveat: 'Approved writing example; not measured effectiveness or verified facts.',
      } })),
    ].sort((a, b) => a.id.localeCompare(b.id));
  }

  async recentLessons() {
    const records = await this.knowledge.find().sort({ createdAt: -1, _id: -1 }).limit(30)
      .select('patternSummary diagnosis rootCause recommendedFix').lean();
    return records.map((item) => ({ patternSummary: text(item.patternSummary), diagnosis: text(item.diagnosis),
      rootCause: text(item.rootCause), recommendedFix: text(item.recommendedFix) }));
  }
}
