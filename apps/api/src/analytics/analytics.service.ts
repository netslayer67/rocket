import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Narrative } from '../narratives/schemas/narrative.schema';
import { CaptureAnalyticsDto } from './dto/capture-analytics.dto';
import { Analytics } from './schemas/analytics.schema';

@Injectable()
export class AnalyticsService {
  constructor(@InjectModel(Analytics.name) private readonly analytics: Model<Analytics>, @InjectModel(Narrative.name) private readonly narratives: Model<Narrative>) {}

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
