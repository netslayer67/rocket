import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class LearningCycle {
  @Prop({ required: true }) fingerprint!: string;
  @Prop({ required: true }) attempt!: number;
  @Prop({ required: true }) day!: string;
  @Prop({ type: [String], default: [] }) evidenceIds!: string[];
  @Prop({ enum: ['synthesizing', 'validating', 'saving', 'complete', 'rejected', 'failed'], required: true }) phase!: string;
  @Prop({ default: '' }) reason!: string;
  @Prop({ type: [String], default: [] }) models!: string[];
  @Prop() knowledgeId?: string;
  @Prop() finishedAt?: Date;
  createdAt!: Date;
  updatedAt!: Date;
}

export const LearningCycleSchema = SchemaFactory.createForClass(LearningCycle);
LearningCycleSchema.index({ fingerprint: 1, day: 1, attempt: 1 }, { unique: true });
LearningCycleSchema.index({ day: 1 });
LearningCycleSchema.index({ createdAt: -1 });
