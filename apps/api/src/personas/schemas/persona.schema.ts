import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PersonaDocument = HydratedDocument<Persona>;

@Schema({ timestamps: true })
export class Persona {
  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, trim: true })
  tone!: string;

  @Prop({ type: [String], default: [] })
  vocabulary!: string[];

  @Prop({ required: true, enum: ['short', 'medium', 'long'] })
  sentenceLength!: 'short' | 'medium' | 'long';

  @Prop({ default: '' })
  emojiHabit!: string;

  @Prop({ default: '' })
  interactionStyle!: string;

  @Prop({ default: '' })
  thinkingStyle!: string;

  @Prop({ default: '' })
  observationStyle!: string;

  @Prop({ type: [String], default: [] })
  reasoningPatterns!: string[];
}

export const PersonaSchema = SchemaFactory.createForClass(Persona);
