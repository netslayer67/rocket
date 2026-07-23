import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NarrativeDocument = HydratedDocument<Narrative>;

@Schema({ timestamps: true })
export class Narrative {
  @Prop({ required: true })
  topic!: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Persona' })
  personaId!: Types.ObjectId;

  @Prop()
  referenceTitle?: string;

  @Prop()
  referenceUrl?: string;

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  body!: string;

  @Prop({ required: true })
  linkPlacement!: string;

  @Prop({ type: [String], default: [] })
  reviewerNotes!: string[];

  @Prop({ enum: ['draft', 'approved'], default: 'draft' })
  status!: 'draft' | 'approved';

  @Prop()
  publishedThreadId?: string;

  @Prop()
  publishedAt?: Date;
}

export const NarrativeSchema = SchemaFactory.createForClass(Narrative);
