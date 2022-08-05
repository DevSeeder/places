import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MongooseRepository } from '../../../domain/repository/mongoose/mongoose.repository';
import {
  LogAction,
  LogActionDocument
} from '../../../domain/schemas/logaction.schema';

@Injectable()
export class LogActionsMongoose extends MongooseRepository<
  LogAction,
  LogActionDocument
> {
  constructor(
    @InjectModel(LogAction.name)
    model: Model<LogActionDocument>
  ) {
    super(model);
  }
}
