import { Injectable } from '@nestjs/common';
import { ValidateInputParamsService } from '../../../validate/validate-input-params.service';
import { LogSeedJobService } from '../../../logseed/log-seed-job.service';
import { SeedNeighborhoodsService } from './seed-neighborhoods.service';
import { ValidOutputSearchByState } from '../../../../interface/valid-output-search/valid-outpu-search.interface';
import { City } from '../../../../schemas/city.schema';
import { ObjectId } from 'mongoose';

@Injectable()
export abstract class JobSeedNeighborhoodsService extends SeedNeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    protected readonly logSeedService: LogSeedJobService
  ) {
    super(validateService);
  }

  async logErrorSeedJob(
    convertedSearch: ValidOutputSearchByState,
    city: City,
    err: Error
  ): Promise<ObjectId> {
    this.logger.error(`Error City[${city.id}] ${city.name}`);
    this.logger.error(err.message);
    console.error(err);
    return this.logSeedService.logSeedByState(
      convertedSearch.country,
      convertedSearch.state,
      city,
      err
    );
  }
}
