import { Injectable } from '@nestjs/common';
import { InvalidLogSeedResolutionException } from '../../../../../core/error-handling/exception/invalid-logseed-resolution.exception';
import { EnumTypeAction } from '../../../enumerators/enum-type-action';
import { MongooseDocumentID } from '../../../repository/mongoose/mongoose.repository';
import { EnumTypeResolution } from '../../../enumerators/enum-type-resolution';
import { ProcessResolution } from '../../../interface/resolution/process-resolution-interface';
import { ReferenceNeighborhoodsByState } from '../../../model/references/reference-neighborhoods-by-state.model';
import { ReferenceResolution } from '../../../model/references/reference-resolution.model';
import { LogSeed } from '../../../schemas/logseed.schema';
import { DeleteCityByIdService } from '../../cities/delete-city-by-id.service';
import { LogActionService } from '../../logactions/log-action.service';
import { AbstractProcessResolution } from './abstract-process-resolution.service';

@Injectable()
export class ProcessResolutionIsNotACityService
  extends AbstractProcessResolution
  implements ProcessResolution
{
  constructor(
    protected readonly logActionService: LogActionService,
    protected readonly deleteCityService: DeleteCityByIdService
  ) {
    super(logActionService);
  }

  async process(
    logSeed: LogSeed,
    resolution: ReferenceResolution,
    idLogExecution?: MongooseDocumentID
  ) {
    if (!(logSeed.reference instanceof ReferenceNeighborhoodsByState)) {
      throw new InvalidLogSeedResolutionException(
        EnumTypeResolution.IsNotACity,
        resolution.idLogSeed
      );
    }

    await this.logActionService.saveLogAction(
      EnumTypeAction.DeleteCity,
      logSeed.reference,
      idLogExecution
    );

    await this.deleteCityService.deleteCityById(logSeed.reference.cityId);
  }
}
