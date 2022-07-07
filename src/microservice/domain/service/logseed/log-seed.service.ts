import { Injectable } from '@nestjs/common';
import { LogSeedMongoose } from '../../../adapter/repository/logseed/logseed-mongoose.repository';
import { AbstractService } from '../abstract-service.service';

@Injectable()
export class LogSeedService extends AbstractService {
  constructor(protected readonly mongoRepository: LogSeedMongoose) {
    super();
  }
}
