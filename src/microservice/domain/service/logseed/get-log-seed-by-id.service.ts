import { Injectable } from '@nestjs/common';
import { ObjectId } from 'mongoose';
import { LogSeedMongoose } from '../../../adapter/repository/logseed/logseed-mongoose.repository';
import { LogSeed } from '../../schemas/logseed.schema';
import { LogSeedService } from './log-seed.service';

@Injectable()
export class GetLogSeedByIdService extends LogSeedService {
  constructor(protected readonly mongoRepository: LogSeedMongoose) {
    super(mongoRepository);
  }

  async getLogSeedById(id: string | ObjectId): Promise<LogSeed> {
    return this.mongoRepository.findById(id);
  }
}
