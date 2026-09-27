import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import type { AiRetrievalMetadata } from '../../ai/ai.types';
import type { DraftQuality } from '../draft-quality';
import type { ContentSequence, NarrativeReference } from '../narrative-sequence';

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

  @Prop({ type: [{ title: String, url: String }], default: [] })
  references?: NarrativeReference[];

  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  body!: string;

  @Prop({ required: true })
  linkPlacement!: string;

  @Prop({ type: Object })
  sequence?: ContentSequence;

  @Prop({ type: [String], default: [] })
  reviewerNotes!: string[];

  @Prop({ type: Object })
  retrieval?: AiRetrievalMetadata;

  @Prop({ type: Object })
  quality?: DraftQuality;

  @Prop({ enum: ['draft', 'approved'], default: 'draft' })
  status!: 'draft' | 'approved';

  @Prop()
  publishedThreadId?: string;

  @Prop()
  publishedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'Knowledge' })
  outcomeKnowledgeId?: Types.ObjectId;

  @Prop()
  outcomePromotedAt?: Date;
}

export const NarrativeSchema = SchemaFactory.createForClass(Narrative);
