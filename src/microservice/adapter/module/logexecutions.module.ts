import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  LogExecution,
  LogExecutionSchema
} from '../../domain/schemas/logexecution.schema';
import { LogExecutionMongoose } from '../repository/logexecutions/logexecution-mongoose.repository';
import { LogExecutionService } from '../../domain/service/logexecutions/log-execution.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: LogExecution.name, schema: LogExecutionSchema }
    ])
  ],
  controllers: [],
  providers: [LogExecutionMongoose, LogExecutionService],
  exports: [LogExecutionService]
})
export class LogExecutionsModule {}
