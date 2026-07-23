import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'jobs', timestamps: true })
export class NarrativeJob {
  @Prop({ required: true, unique: true, index: true })
  jobId!: string;

  @Prop({ type: [Object], default: [] })
  events!: Array<{ sequence: number; type: string; data: Record<string, unknown> }>;

  @Prop({ type: Object })
  payload?: Record<string, unknown>;

  @Prop()
  startedAt?: Date;

  @Prop()
  completedAt?: Date;
}

export const NarrativeJobSchema = SchemaFactory.createForClass(NarrativeJob);
