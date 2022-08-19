import { Injectable } from '@nestjs/common';
import { LogSeedMongoose } from '../../../adapter/repository/logseed/logseed-mongoose.repository';
import { LogSeed } from '../../schemas/logseed.schema';
import { LogSeedService } from './log-seed.service';

@Injectable()
export class GetLogSeedByCityService extends LogSeedService {
  constructor(protected readonly mongoRepository: LogSeedMongoose) {
    super(mongoRepository);
  }

  async getLogSeedByCity(
    id: number,
    errorRef: string,
    processed = false
  ): Promise<LogSeed[]> {
    return this.mongoRepository.find({
      'reference.cityId': id,
      'error.name': errorRef,
      processed
    });
  }
}
