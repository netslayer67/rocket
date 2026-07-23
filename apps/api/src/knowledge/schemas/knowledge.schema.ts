import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type KnowledgeDocument = HydratedDocument<Knowledge>;

@Schema({ timestamps: true })
export class Knowledge {
  @Prop({ required: true })
  sourceLabel!: string;

  @Prop()
  sourceUrl?: string;

  @Prop({ type: [String], default: [] })
  topics!: string[];

  @Prop({ required: true })
  hookType!: string;

  @Prop({ required: true })
  emotion!: string;

  @Prop({ required: true })
  narrativeType!: string;

  @Prop({ min: 1, max: 5, required: true })
  curiosityLevel!: number;

  @Prop({ required: true })
  linkPlacement!: string;

  @Prop({ required: true, maxlength: 700 })
  patternSummary!: string;

  @Prop({ default: '' })
  conflict!: string;

  @Prop({ default: '' })
  persona!: string;

  @Prop({ default: '' })
  style!: string;

  @Prop({ type: [String], default: [] })
  vocabulary!: string[];

  @Prop({ default: '' })
  informationGap!: string;

  @Prop({ default: '' })
  discussionPattern!: string;

  @Prop({ default: '' })
  authorityType!: string;

  @Prop({ default: '' })
  ctaStyle!: string;

  @Prop({ min: 1, max: 5, default: 3 })
  naturalness!: number;

  @Prop({ enum: ['positive', 'negative'] })
  lessonType?: 'positive' | 'negative';

  @Prop({ default: '' })
  diagnosis?: string;

  @Prop({ default: '' })
  rootCause?: string;

  @Prop({ default: '' })
  recommendedFix?: string;

  @Prop({ type: [String], default: [] })
  failureDimensions?: string[];

  @Prop({ type: [String], default: [] })
  evidenceSources?: string[];

  @Prop({ enum: ['pending', 'ready'], default: 'pending' })
  vectorStatus!: 'pending' | 'ready';

  @Prop()
  embeddingModel?: string;
}

export const KnowledgeSchema = SchemaFactory.createForClass(Knowledge);
KnowledgeSchema.index({ topics: 1, createdAt: -1 });
KnowledgeSchema.index({ vectorStatus: 1, createdAt: -1 });
