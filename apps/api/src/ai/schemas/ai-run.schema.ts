import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AiRunDocument = HydratedDocument<AiRun>;

@Schema({ timestamps: true })
export class AiRun {
  @Prop({ required: true })
  task!: string;

  @Prop({ required: true })
  model!: string;

  @Prop({ required: true })
  inputHash!: string;

  @Prop({ default: false })
  cached!: boolean;

  @Prop({ default: false })
  demo!: boolean;

  @Prop()
  inputTokens?: number;

  @Prop()
  outputTokens?: number;
}

export const AiRunSchema = SchemaFactory.createForClass(AiRun);
