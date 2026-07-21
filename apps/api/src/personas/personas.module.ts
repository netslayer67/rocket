import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PersonasController } from './personas.controller';
import { PersonasService } from './personas.service';
import { Persona, PersonaSchema } from './schemas/persona.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Persona.name, schema: PersonaSchema }])],
  controllers: [PersonasController],
  providers: [PersonasService],
  exports: [PersonasService],
})
export class PersonasModule {}
