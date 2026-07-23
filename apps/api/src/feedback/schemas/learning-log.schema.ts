import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LearningLogDocument = HydratedDocument<LearningLog>;

@Schema({ timestamps: true })
export class LearningLog {
  @Prop({ type: Types.ObjectId, required: true, unique: true, ref: 'Feedback' })
  feedbackId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Knowledge' })
  knowledgeId?: Types.ObjectId;

  @Prop({ enum: ['complete', 'failed'], required: true })
  status!: 'complete' | 'failed';

  @Prop({ default: '' })
  error?: string;
}

export const LearningLogSchema = SchemaFactory.createForClass(LearningLog);
