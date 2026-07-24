import { BadRequestException, Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Narrative } from '../narratives/schemas/narrative.schema';
import { CaptureAnalyticsDto } from './dto/capture-analytics.dto';
import { Analytics } from './schemas/analytics.schema';
import { PromoteOutcomeDto } from './dto/promote-outcome.dto';
import { KnowledgeService } from '../knowledge/knowledge.service';

@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(Analytics.name) private readonly analytics: Model<Analytics>, @InjectModel(Narrative.name) private readonly narratives: Model<Narrative>, @Optional() private readonly knowledge?: KnowledgeService) {}

  async capture(dto: CaptureAnalyticsDto) {
    const narrative = await this.narratives.findById(dto.narrativeId).lean();
    if (!narrative) throw new NotFoundException('Narrative tidak ditemukan');
    const metrics = { views: dto.views ?? 0, clicks: dto.clicks ?? 0, likes: dto.likes ?? 0, replies: dto.replies ?? 0, reposts: dto.reposts ?? 0, quotes: dto.quotes ?? 0 };
    const saved = await this.analytics.create({ ...metrics, narrativeId: dto.narrativeId, publishedThreadId: dto.publishedThreadId ?? narrative.publishedThreadId, ...rates(metrics) });
    return saved.toObject();
  }

  async summary() {
    const rows = await this.analytics.find().sort({ capturedAt: -1 }).limit(100).lean();
    const totals = rows.reduce((sum, row) => ({ views: sum.views + row.views, clicks: sum.clicks + row.clicks, likes: sum.likes + row.likes, replies: sum.replies + row.replies, reposts: sum.reposts + row.reposts, quotes: sum.quotes + row.quotes }), emptyTotals());
    return { source: 'manual capture', records: rows.length, ...totals, ...rates(totals) };
  }

  async insights() {
    const rows = await this.analytics.find().sort({ capturedAt: -1 }).limit(100).lean();
    const grouped = new Map<string, ReturnType<typeof emptyTotals> & { samples: number }>();
    rows.forEach((row) => {
      const key = String(row.narrativeId);
      const current = grouped.get(key) ?? { ...emptyTotals(), samples: 0 };
      current.views += row.views; current.clicks += row.clicks; current.likes += row.likes;
      current.replies += row.replies; current.reposts += row.reposts; current.quotes += row.quotes; current.samples++;
      grouped.set(key, current);
    });
    const narratives = await this.narratives.find({ _id: { $in: [...grouped.keys()] } }).lean();
    const byId = new Map(narratives.map((item) => [String(item._id), item]));
    return [...grouped.entries()].map(([narrativeId, metrics]) => {
      const narrative = byId.get(narrativeId);
      if (!narrative) return undefined;
      return { narrativeId, title: narrative.title, topic: narrative.topic, linkPlacement: narrative.linkPlacement, ...metrics, ...rates(metrics), source: 'manual capture', status: narrative.outcomeKnowledgeId ? 'promoted' as const : 'candidate' as const };
    }).filter(Boolean);
  }

  async promote(narrativeId: string, dto: PromoteOutcomeDto) {
    if (dto.approved !== true) throw new BadRequestException('Explicit approval is required.');
    if (!this.knowledge) throw new BadRequestException('Knowledge learning is not configured.');
    const narrative = await this.narratives.findById(narrativeId).lean();
    if (!narrative) throw new NotFoundException('Narrative tidak ditemukan');
    if (narrative.outcomeKnowledgeId) return { status: 'already-promoted', knowledgeId: String(narrative.outcomeKnowledgeId) };
    const candidate = (await this.insights()).find((item) => item?.narrativeId === narrativeId);
    if (!candidate) throw new BadRequestException('Belum ada analytics manual untuk dipromosikan.');
    const lesson = await this.knowledge.createLesson({
      sourceLabel: `Outcome candidate ${narrativeId}`,
      topics: [narrative.topic.slice(0, 120)], hookType: 'outcome-observed', emotion: dto.lessonType === 'positive' ? 'confidence' : 'caution', narrativeType: 'analytics feedback', curiosityLevel: dto.lessonType === 'positive' ? 4 : 2,
      linkPlacement: narrative.linkPlacement, patternSummary: dto.notes?.trim().slice(0, 700) || `Manual outcome: ${candidate.views} views, ${candidate.clicks} clicks, ${candidate.samples} capture.`, conflict: `CTR ${candidate.ctr ?? 'n/a'}; engagement ${candidate.engagementRate ?? 'n/a'}`,
      persona: 'outcome evidence', style: 'measured and diagnosis-first', vocabulary: [], informationGap: '', discussionPattern: 'compare measured outcomes', authorityType: 'manual analytics', ctaStyle: 'reference', naturalness: dto.lessonType === 'positive' ? 4 : 2,
      lessonType: dto.lessonType, diagnosis: `Signal observed from ${candidate.samples} manual capture; this is not a causal claim.`, rootCause: 'Outcome pattern requires more reviewed examples before generalization.', recommendedFix: dto.notes?.trim().slice(0, 700) || 'Compare this signal with future captures before changing generation.', failureDimensions: dto.lessonType === 'negative' ? ['narrative', 'reference'] : [], evidenceSources: ['manual-analytics'],
    });
    await this.narratives.updateOne({ _id: narrativeId }, { outcomeKnowledgeId: lesson._id, outcomePromotedAt: new Date() });
    return { status: 'promoted', knowledgeId: String(lesson._id), candidate: { ...candidate, status: 'promoted' as const } };
  }
}

function emptyTotals() {
  return { views: 0, clicks: 0, likes: 0, replies: 0, reposts: 0, quotes: 0 };
}

function rates(metrics: ReturnType<typeof emptyTotals>) {
  if (!metrics.views) return { ctr: null, engagementRate: null };
  return { ctr: round(metrics.clicks / metrics.views * 100), engagementRate: round((metrics.likes + metrics.replies + metrics.reposts + metrics.quotes) / metrics.views * 100) };
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
