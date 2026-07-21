import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { Persona } from './schemas/persona.schema';

@Injectable()
export class PersonasService {
  constructor(@InjectModel(Persona.name) private readonly personas: Model<Persona>) {}

  create(dto: CreatePersonaDto) {
    return this.personas.create(dto);
  }

  findAll() {
    return this.personas.find().sort({ createdAt: -1 }).lean();
  }

  findById(id: string) {
    return this.personas.findById(id).lean();
  }
}
