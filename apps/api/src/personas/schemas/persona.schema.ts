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

  @Prop({ default: '' })
  coreIdentity!: string;

  @Prop({ default: '' })
  claimBoundaries!: string;

  @Prop({ type: [String], default: [] })
  currentInterests!: string[];

  @Prop({ default: false })
  active!: boolean;

  @Prop()
  archivedAt?: Date;
}

export const PersonaSchema = SchemaFactory.createForClass(Persona);
PersonaSchema.index({ active: 1 }, { unique: true, partialFilterExpression: { active: true } });
