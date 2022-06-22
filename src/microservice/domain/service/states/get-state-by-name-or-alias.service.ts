import { Injectable } from '@nestjs/common';
import { StatesMongoose } from '../../../adapter/repository/states/states-mongoose.repository';
import { State } from '../../schemas/state.schema';
import { StatesService } from './states.service';

@Injectable()
export class GetStateByNameOrAliasService extends StatesService {
  constructor(mongoRepository: StatesMongoose) {
    super(mongoRepository);
  }

  async getStateByNameOrAlias(
    name: string,
    countryId: number
  ): Promise<State[]> {
    return this.mongoRepository.findByNameOrAlias(name, { countryId });
  }
}
