import { Injectable } from '@nestjs/common';
import { MongooseDocumentID } from '../../../../repository/mongoose/mongoose.repository';
import { ProcessResolution } from '../../../../interface/resolution/process-resolution-interface';
import { ReferenceNeighborhoodsByState } from '../../../../model/references/reference-neighborhoods-by-state.model';
import { ReferenceResolution } from '../../../../model/references/reference-resolution.model';
import { LogSeed } from '../../../../schemas/logseed.schema';
import { DeleteCityByIdService } from '../../../cities/delete-city-by-id.service';
import { LogActionService } from '../../../logactions/log-action.service';
import { ProcessResolutionCity } from './process-resolution-city.service';
import { EnumTypeAction } from '../../../../enumerators/enum-type-action';

@Injectable()
export class ProcessResolutionIsNotACityService
  extends ProcessResolutionCity
  implements ProcessResolution<ReferenceNeighborhoodsByState>
{
  constructor(
    protected readonly logActionService: LogActionService,
    protected readonly deleteCityService: DeleteCityByIdService
  ) {
    super(logActionService, EnumTypeAction.DeleteCity);
  }

  async process(
    logSeed: LogSeed,
    resolution: ReferenceResolution,
    idLogExecution?: MongooseDocumentID
  ) {
    const reference = this.getReference(logSeed.reference);

    this.logger.log(`Deleting City ${reference.cityName}...`);

    await this.deleteCityService.deleteCityById(reference.cityId);

    await super.process(logSeed, resolution, idLogExecution);
  }
}
