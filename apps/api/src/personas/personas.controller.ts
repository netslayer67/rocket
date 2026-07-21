import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { PersonasService } from './personas.service';

@Controller('personas')
export class PersonasController {
  constructor(private readonly personas: PersonasService) {}

  @Get()
  findAll() {
    return this.personas.findAll();
  }

  @Post()
  create(@Body() dto: CreatePersonaDto) {
    return this.personas.create(dto);
  }
}
