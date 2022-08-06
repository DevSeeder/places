import { Injectable } from '@nestjs/common';
import { EnumTypeAction } from '../../../../enumerators/enum-type-action';
import { MongooseDocumentID } from '../../../../repository/mongoose/mongoose.repository';
import { ProcessResolution } from '../../../../interface/resolution/process-resolution-interface';
import { ReferenceNeighborhoodsByState } from '../../../../model/references/reference-neighborhoods-by-state.model';
import { ReferenceResolution } from '../../../../model/references/reference-resolution.model';
import { LogSeed } from '../../../../schemas/logseed.schema';
import { LogActionService } from '../../../logactions/log-action.service';
import { ProcessResolutionCity } from './process-resolution-city.service';
import { SaveNeighborhoodsByCityService } from '../../../neighborhoods/save-neighborhoods-by-city.service';
import { ValidateStateByNameOrAliasService } from '../../../states/validate-state-by-name-or-alias.service';
import { ValidateInputParamsService } from '../../../validate/validate-input-params.service';
import { ValidOutputSearchByCityBuilder } from '../../../../../adapter/helper/builder/valid/valid-output-search-by-city.builder';
import { Neighborhood } from '../../../../schemas/neighborhood.schema';

@Injectable()
export class ProcessResolutionUniqueNeighborhoodService
  extends ProcessResolutionCity
  implements ProcessResolution<ReferenceNeighborhoodsByState>
{
  constructor(
    protected readonly logActionService: LogActionService,
    protected readonly validateService: ValidateInputParamsService,
    protected readonly validateStateService: ValidateStateByNameOrAliasService,
    protected readonly saveNeighborhoodService: SaveNeighborhoodsByCityService
  ) {
    super(logActionService, EnumTypeAction.CreateManualNeighborhood);
  }

  async process(
    logSeed: LogSeed,
    resolution: ReferenceResolution,
    idLogExecution?: MongooseDocumentID
  ) {
    const reference = this.getReference(logSeed.reference);

    await this.createManualNeighborhood(reference, resolution.dataResolution);

    await super.process(logSeed, resolution, idLogExecution);
  }

  async createManualNeighborhood(
    reference: ReferenceNeighborhoodsByState,
    name: string
  ) {
    const convertedSearch = new ValidOutputSearchByCityBuilder(
      reference
    ).build();

    const state = await this.validateStateService.validateState(
      reference.stateName,
      reference.countryId
    );

    convertedSearch.state.stateCode = state.stateCode;

    const neighborhood = new Neighborhood();
    neighborhood.name = name;

    await this.saveNeighborhoodService.createNeighborhood(
      neighborhood,
      convertedSearch
    );
  }
}
