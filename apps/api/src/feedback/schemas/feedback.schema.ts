import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema({ timestamps: true })
export class Feedback {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Narrative' })
  narrativeId!: Types.ObjectId;

  @Prop({ enum: ['positive', 'negative'], required: true })
  lessonType!: 'positive' | 'negative';

  @Prop({ type: Object, default: {} })
  scores!: Record<string, number>;

  @Prop({ maxlength: 1000, default: '' })
  notes!: string;

  @Prop({ default: false })
  approvedForLearning!: boolean;

  @Prop()
  learnedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Knowledge' })
  knowledgeId?: Types.ObjectId;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
FeedbackSchema.index({ approvedForLearning: 1, learnedAt: 1 });
