import { Injectable } from '@nestjs/common';
import { StatesMongoose } from '../../../adapter/repository/states/states-mongoose.repository';
import { StatesService } from './states.service';
import { ValidateStateByNameOrAliasService } from './validate-state-by-name-or-alias.service';

@Injectable()
export class UpdateStatesByRegionService extends StatesService {
  constructor(
    mongoRepository: StatesMongoose,
    protected readonly validateStateService: ValidateStateByNameOrAliasService
  ) {
    super(mongoRepository);
  }

  async updateStatesByRegion(
    region: string,
    states: Array<string>,
    countryId: number
  ): Promise<void> {
    this.logger.log(`Updating states for region '${region}'...`);
    states.forEach(async (stateName) => {
      const state = await this.validateStateService.validateState(
        stateName,
        countryId
      );

      this.logger.log(`Updating state[${state.id}] - ${state.name}...`);

      await this.mongoRepository.updateById(state.id, {
        region
      });
    });

    this.logger.log(`Update finished!`);
  }
}
