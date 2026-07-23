import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThreadsController } from './threads.controller';
import { ThreadsConnection, ThreadsConnectionSchema } from './schemas/threads-connection.schema';
import { ThreadsService } from './threads.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ThreadsConnection.name, schema: ThreadsConnectionSchema }])],
  controllers: [ThreadsController],
  providers: [ThreadsService],
  exports: [ThreadsService],
})
export class ThreadsModule {}
