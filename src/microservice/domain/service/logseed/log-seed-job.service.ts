import { Injectable } from '@nestjs/common';
import { LogSeedMongoose } from '../../../adapter/repository/logseed/logseed-mongoose.repository';
import { EnumTypeLogSeed } from '../../enumerators/enum-type-logseed';
import {
  LogSeed,
  ReferenceLogSeed,
  ReferenceNeighborhoodsByState
} from '../../schemas/logseed.schema';
import { AbstractService } from '../abstract-service.service';

@Injectable()
export class LogSeedJobService extends AbstractService {
  constructor(protected readonly mongoRepository: LogSeedMongoose) {
    super();
  }

  private async createLogSeed(
    type: EnumTypeLogSeed,
    reference: ReferenceLogSeed,
    error: Error
  ) {
    this.logger.log('Logging seed error....');
    const logSeed = new LogSeed();
    logSeed.type = type;
    logSeed.reference = reference;
    logSeed.datetime = new Date();
    logSeed.ip = 'request.ip';
    logSeed.success = false;
    logSeed.processed = false;
    logSeed.error = error;
    await this.mongoRepository.insertOne(logSeed, 'Log Seed Job');
  }

  async logSeedByState(
    countryId: number,
    stateId: number,
    cityId: number,
    error: Error
  ) {
    const reference = new ReferenceNeighborhoodsByState(
      countryId,
      stateId,
      cityId
    );
    await this.createLogSeed(
      EnumTypeLogSeed.NeighborhoodsByState,
      reference,
      error
    );
  }
}
