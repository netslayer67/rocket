import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Narrative } from '../narratives/schemas/narrative.schema';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { Feedback } from './schemas/feedback.schema';
import { LearningService } from './learning.service';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectModel(Feedback.name) private readonly feedback: Model<Feedback>,
    @InjectModel(Narrative.name) private readonly narratives: Model<Narrative>,
    private readonly learning: LearningService,
  ) {}

  async create(dto: CreateFeedbackDto) {
    if (!await this.narratives.exists({ _id: dto.narrativeId })) throw new NotFoundException('Narrative tidak ditemukan');
    const item = await this.feedback.create({ ...dto, scores: normalizeScores(dto.scores), notes: dto.notes?.trim() ?? '' });
    if (dto.approvedForLearning) await this.learning.learnOne(String(item._id));
    return this.feedback.findById(item._id).lean();
  }

  run() {
    return this.learning.runPending();
  }
}

function normalizeScores(scores: Record<string, number>) {
  return Object.fromEntries(Object.entries(scores).slice(0, 14).map(([key, value]) => [key, Math.max(0, Math.min(10, Number(value) || 0))]));
}
