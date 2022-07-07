import { Injectable } from '@nestjs/common';
import { LogSeedMongoose } from '../../../adapter/repository/logseed/logseed-mongoose.repository';
import { EnumTypeLogSeed } from '../../enumerators/enum-type-logseed';
import {
  ReferenceLogSeed,
  ReferenceNeighborhoodsByState
} from '../../model/logseed/reference/reference-neighborhoods-by-state.model';
import { City } from '../../schemas/city.schema';
import { Country } from '../../schemas/country.schema';
import { LogSeed } from '../../schemas/logseed.schema';
import { State } from '../../schemas/state.schema';
import { LogSeedService } from './log-seed.service';

@Injectable()
export class LogSeedJobService extends LogSeedService {
  constructor(protected readonly mongoRepository: LogSeedMongoose) {
    super(mongoRepository);
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
    logSeed.ip = 'localhost';
    logSeed.success = false;
    logSeed.processed = false;
    logSeed.error = error;
    return this.mongoRepository.insertOne(logSeed, 'Log Seed Job');
  }

  async logSeedByState(
    country: Country,
    state: State,
    city: City,
    error: Error
  ) {
    const reference = new ReferenceNeighborhoodsByState(
      country.id,
      state.id,
      city.id,
      country.name,
      state.name,
      city.name
    );
    return this.createLogSeed(
      EnumTypeLogSeed.NeighborhoodsByState,
      reference,
      error
    );
  }
}
