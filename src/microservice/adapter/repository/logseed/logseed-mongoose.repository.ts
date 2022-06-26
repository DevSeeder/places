import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  LogSeed,
  LogSeedDocument
} from '../../../domain/schemas/logseed.schema';
import { MongooseRepository } from '../../../domain/repository/mongoose/mongoose.repository';

@Injectable()
export class LogSeedMongoose extends MongooseRepository<
  LogSeed,
  LogSeedDocument
> {
  constructor(
    @InjectModel(LogSeed.name)
    model: Model<LogSeedDocument>
  ) {
    super(model);
  }
}
