import { Body, Controller, Get, Post } from '@nestjs/common';
import { ImportKnowledgeDto } from './dto/import-knowledge.dto';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly knowledge: KnowledgeService) {}

  @Get()
  findAll() {
    return this.knowledge.findAll();
  }

  @Post('import')
  import(@Body() dto: ImportKnowledgeDto) {
    return this.knowledge.import(dto);
  }

  @Post('reindex')
  reindex() {
    return this.knowledge.reindex();
  }
}
