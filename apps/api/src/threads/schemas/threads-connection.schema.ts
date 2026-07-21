import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ThreadsConnectionDocument = HydratedDocument<ThreadsConnection>;

@Schema({ timestamps: true })
export class ThreadsConnection {
  @Prop({ required: true, unique: true, default: 'default' })
  key!: string;

  @Prop({ required: true })
  accountId!: string;

  @Prop({ required: true, select: false })
  tokenCiphertext!: string;

  @Prop({ required: true, select: false })
  tokenIv!: string;

  @Prop({ required: true, select: false })
  tokenTag!: string;

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop({ required: true, default: Date.now })
  connectedAt!: Date;
}

export const ThreadsConnectionSchema = SchemaFactory.createForClass(ThreadsConnection);
