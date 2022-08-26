import { Injectable } from '@nestjs/common';
import { EnumTypeAction } from '../../../../enumerators/enum-type-action';
import { MongooseDocumentID } from '../../../../repository/mongoose/mongoose.repository';
import { ProcessResolution } from '../../../../interface/resolution/process-resolution-interface';
import { ReferenceNeighborhoodsByState } from '../../../../model/references/reference-neighborhoods-by-state.model';
import { ReferenceResolution } from '../../../../model/references/reference-resolution.model';
import { LogSeed } from '../../../../schemas/logseed.schema';
import { LogActionService } from '../../../logactions/log-action.service';
import { ProcessResolutionCity } from './process-resolution-city.service';
import { UpdateCityByIdService } from '../../../cities/update-city-by-id.service';

@Injectable()
export class ProcessResolutionWrongCityNameService
  extends ProcessResolutionCity
  implements ProcessResolution<ReferenceNeighborhoodsByState>
{
  constructor(
    protected readonly logActionService: LogActionService,
    protected readonly updateCityService: UpdateCityByIdService
  ) {
    super(logActionService, EnumTypeAction.UpdateNameCity);
  }

  async process(
    logSeed: LogSeed,
    resolution: ReferenceResolution,
    idLogExecution?: MongooseDocumentID
  ) {
    const reference = this.getReference(logSeed.reference);

    this.logger.log(
      `Updating City Name '${reference.cityName}' to '${resolution.dataResolution}'...`
    );

    await this.updateCityService.updateCityById(
      reference.cityId,
      {
        name: resolution.dataResolution
      },
      {
        $push: {
          alias: resolution.dataResolution
        }
      }
    );

    await super.process(logSeed, resolution, idLogExecution);
  }
}
