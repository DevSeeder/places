import { Injectable } from '@nestjs/common';
import { InvalidLogSeedResolutionException } from 'src/core/error-handling/exception/invalid-logseed-resolution.exception';
import { EnumTypeResolution } from '../../enumerators/enum-type-resolution';
import { ProcessResolution } from '../../interface/resolution/process-resolution-interface';
import { ReferenceNeighborhoodsByState } from '../../model/references/reference-neighborhoods-by-state.model';
import { ReferenceResolution } from '../../model/references/reference-resolution.model';
import { LogSeed } from '../../schemas/logseed.schema';
import { AbstractService } from '../abstract-service.service';
import { DeleteCityByIdService } from '../cities/delete-city-by-id.service';

@Injectable()
export class ProcessResolutionIsNotACityService
  extends AbstractService
  implements ProcessResolution
{
  constructor(protected readonly deleteCityService: DeleteCityByIdService) {
    super();
  }

  async process(logSeed: LogSeed, resolution: ReferenceResolution) {
    if (!(logSeed.reference instanceof ReferenceNeighborhoodsByState)) {
      throw new InvalidLogSeedResolutionException(
        EnumTypeResolution.IsNotACity,
        resolution.idLogSeed
      );
    }
    await this.deleteCityService.deleteCityById(logSeed.reference.cityId);
  }
}
