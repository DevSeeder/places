import { Injectable } from '@nestjs/common';
import { DateHelper } from '../../../adapter/helper/date.helper';
import { LogSeedMongoose } from '../../../adapter/repository/logseed/logseed-mongoose.repository';
import { EnumTypeLogSeed } from '../../enumerators/enum-type-logseed';
import { EnumTypeResolution } from '../../enumerators/enum-type-resolution';
import { ReferenceNeighborhoodsByState } from '../../model/references/reference-neighborhoods-by-state.model';
import { Reference } from '../../model/references/reference.model';
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
    reference: Reference,
    error: Error
  ) {
    this.logger.log('Logging seed error....');
    const logSeed = new LogSeed();
    logSeed.type = type;
    logSeed.reference = reference;
    logSeed.datetime = DateHelper.getDateNow();
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

  async logProcessResolution(
    idLogSeed: string,
    resolution: EnumTypeResolution
  ): Promise<void> {
    this.logger.log('Updating logSeed by Resolution...');
    const data = {
      success: true,
      processed: true,
      processedDate: DateHelper.getDateNow(),
      resolution: resolution
    };
    return this.mongoRepository.updateOneById(idLogSeed, data);
  }
}
