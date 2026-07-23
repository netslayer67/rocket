import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AnalyticsDocument = HydratedDocument<Analytics>;

@Schema({ timestamps: true })
export class Analytics {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Narrative' })
  narrativeId!: Types.ObjectId;

  @Prop()
  publishedThreadId?: string;

  @Prop({ min: 0, default: 0 }) views!: number;
  @Prop({ min: 0, default: 0 }) clicks!: number;
  @Prop({ min: 0, default: 0 }) likes!: number;
  @Prop({ min: 0, default: 0 }) replies!: number;
  @Prop({ min: 0, default: 0 }) reposts!: number;
  @Prop({ min: 0, default: 0 }) quotes!: number;
  @Prop() ctr?: number;
  @Prop() engagementRate?: number;
  @Prop({ required: true, default: Date.now }) capturedAt!: Date;
}

export const AnalyticsSchema = SchemaFactory.createForClass(Analytics);
AnalyticsSchema.index({ narrativeId: 1, capturedAt: -1 });
