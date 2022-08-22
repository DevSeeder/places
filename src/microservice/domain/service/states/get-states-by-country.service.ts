import { Injectable } from '@nestjs/common';
import { StatesMongoose } from '../../../adapter/repository/states/states-mongoose.repository';
import { StatesByCountry } from '../../model/states/states-by-country.model';
import { State } from '../../schemas/state.schema';
import { ValidateCountryByNameOrAliasService } from '../countries/validate-country-by-name-or-alias.service';
import { StatesService } from './states.service';

@Injectable()
export class GetStatesByCountryService extends StatesService {
  constructor(
    mongoRepository: StatesMongoose,
    protected readonly validateCountryService: ValidateCountryByNameOrAliasService
  ) {
    super(mongoRepository);
  }

  async getStatesByCountry(countryRef: string): Promise<StatesByCountry[]> {
    const country = await this.validateCountryService.validateCountry(
      countryRef
    );

    this.logger.log('Searching states in database...');

    return this.findStatesByCountry(country.id);
  }

  async findStatesByCountry(
    countryId: number,
    arrIgnore = []
  ): Promise<State[]> {
    const select = {
      _id: 0,
      id: 1,
      name: 1,
      countryId: 1,
      countryCode: 1,
      stateId: 1,
      stateCode: 1
    };

    const match: any = { countryId };

    if (arrIgnore.length > 0) match.id = { $nin: arrIgnore };

    return this.mongoRepository.findBySearchParams(match, select);
  }
}
