import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '../../../domain/repository/mongoose/mongoose.repository';
import {
  LogExecution,
  LogExecutionDocument
} from '../../../domain/schemas/logexecution.schema';

@Injectable()
export class LogExecutionMongoose extends MongooseRepository<
  LogExecution,
  LogExecutionDocument
> {
  constructor(
    @InjectModel(LogExecution.name)
    model: Model<LogExecutionDocument>
  ) {
    super(model);
  }
}
