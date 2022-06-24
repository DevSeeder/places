import { InvalidDataException } from '../../../../../core/error-handling/exception/invalid-data.exception';
import { NeighborhoodsMongoose } from '../../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { Country } from '../../../schemas/country.schema';
import { State } from '../../../schemas/state.schema';
import { GetCountryByNameOrAliasService } from '../../countries/get-country-by-name-or-alias.service';
import { GetStateByNameOrAliasService } from '../../states/get-state-by-name-or-alias.service';
import { NeighborhoodsService } from './../neighborhoods.service';

export abstract class GetNeighborhoodsService extends NeighborhoodsService {
  constructor(
    protected readonly mongoRepository: NeighborhoodsMongoose,
    protected readonly getCountryService: GetCountryByNameOrAliasService,
    protected readonly getStateService: GetStateByNameOrAliasService
  ) {
    super(mongoRepository);
  }

  async validateCountry(country: string): Promise<Country> {
    this.logger.log(`Validating Country '${country}'...`);

    const res = await this.getCountryService.getCountryByNameOrAlias(country);
    if (res.length === 0) throw new InvalidDataException('Country', country);

    this.logger.log(`Country: '${res[0].name}'`);
    return res[0];
  }

  async validateState(state: string, countryId: number): Promise<State> {
    this.logger.log(`Validating State '${state}'...`);

    const res = await this.getStateService.getStateByNameOrAlias(
      state,
      countryId
    );
    if (res.length === 0) throw new InvalidDataException('State', state);

    this.logger.log(`State: '${res[0].name}'`);
    return res[0];
  }
}
