import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { Persona } from './schemas/persona.schema';
import { Narrative } from '../narratives/schemas/narrative.schema';

export type PersonaQuality = { windowDays: number; drafts: number; persona: number; specificity: number; generic: number; productInjection: number };

@Injectable()
export class PersonasService {
  constructor(
    @InjectModel(Persona.name) private readonly personas: Model<Persona>,
    @InjectModel(Narrative.name) private readonly narratives: Model<Narrative>,
  ) {}

  async saveActive(dto: CreatePersonaDto) {
    const active = await this.findActive();
    const profile = { ...dto, currentInterests: dto.currentInterests ?? [], active: true };
    if (active) return this.personas.findByIdAndUpdate(active._id, { $set: profile, $unset: { archivedAt: 1 } }, { new: true }).lean();
    return this.personas.create(profile);
  }

  async findAll() {
    const active = await this.findActive();
    return active ? [active] : [];
  }

  async findActive() {
    const current = await this.personas.findOne({ active: true }).lean();
    if (current) return current;
    const legacy = await this.personas.findOne({ archivedAt: { $exists: false } }).sort({ createdAt: -1, _id: -1 }).lean();
    if (!legacy) return null;
    await this.personas.updateOne({ _id: legacy._id }, { $set: { active: true }, $unset: { archivedAt: 1 } });
    await this.personas.updateMany({ _id: { $ne: legacy._id }, archivedAt: { $exists: false } }, { $set: { active: false, archivedAt: new Date() } });
    return this.personas.findById(legacy._id).lean();
  }

  findById(id: string) {
    return this.personas.findOne({ _id: id, active: true }).lean();
  }

  async quality(): Promise<PersonaQuality> {
    const active = await this.findActive();
    if (!active) return emptyQuality();
    const since = new Date(Date.now() - 30 * 24 * 60 * 60_000);
    const drafts = await this.narratives.find({ personaId: active._id, createdAt: { $gte: since } }).select('reviewerNotes').lean();
    return drafts.reduce((summary, draft) => countNotes(summary, draft.reviewerNotes ?? []), { ...emptyQuality(), drafts: drafts.length });
  }
}

function emptyQuality(): PersonaQuality {
  return { windowDays: 30, drafts: 0, persona: 0, specificity: 0, generic: 0, productInjection: 0 };
}

function countNotes(summary: PersonaQuality, notes: string[]) {
  const text = notes.join(' ');
  if (/persona|human voice/i.test(text)) summary.persona++;
  if (/information gap|proses berpikir|context drift|topic drift/i.test(text)) summary.specificity++;
  if (/AI generic/i.test(text)) summary.generic++;
  if (/product injection|bahasa marketplace|reasoning flow/i.test(text)) summary.productInjection++;
  return summary;
}
