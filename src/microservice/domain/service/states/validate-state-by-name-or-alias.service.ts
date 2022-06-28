import { Injectable } from '@nestjs/common';
import { InvalidDataException } from '../../../../core/error-handling/exception/invalid-data.exception';
import { StatesMongoose } from '../../../adapter/repository/states/states-mongoose.repository';
import { State } from '../../schemas/state.schema';
import { StatesService } from './states.service';

@Injectable()
export class ValidateStateByNameOrAliasService extends StatesService {
  constructor(mongoRepository: StatesMongoose) {
    super(mongoRepository);
  }

  async getStateByNameOrAlias(
    name: string,
    countryId: number
  ): Promise<State[]> {
    return this.mongoRepository.findByNameOrAliasOrId(name, { countryId });
  }

  async validateState(state: string, countryId: number): Promise<State> {
    this.logger.log(`Validating State '${state}'...`);

    const res = await this.getStateByNameOrAlias(state, countryId);
    if (res.length === 0) throw new InvalidDataException('State', state);

    this.logger.log(`State: '${res[0].name}'`);
    return res[0];
  }
}
