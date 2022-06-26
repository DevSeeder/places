import { Injectable } from '@nestjs/common';
import { SearchNeighborhoodsInput } from '../model/search/neighborhoods/search-neighborhoods-input.model';
import { ValidOutputSearchNeighborhood } from '../interface/valid-output-search/valid-outpu-search-neighborhood.interface';
import { AbstractService } from './abstract-service.service';
import { ValidateCountryByNameOrAliasService } from './countries/validate-country-by-name-or-alias.service';
import { ValidateStateByNameOrAliasService } from './states/validate-state-by-name-or-alias.service';
import { ValidateCityByNameOrAliasService } from './cities/validate-city-by-name-or-alias.service';
import { SearchCitiesInput } from '../model/search/cities/search-cities-input.model';

@Injectable()
export class ValidateInputParamsService extends AbstractService {
  constructor(
    private readonly getCountryService: ValidateCountryByNameOrAliasService,
    private readonly getStateService: ValidateStateByNameOrAliasService,
    private readonly getCityService: ValidateCityByNameOrAliasService
  ) {
    super();
  }

  async validateAndConvertSearchByState(
    searchParams: SearchNeighborhoodsInput | SearchCitiesInput
  ): Promise<ValidOutputSearchNeighborhood> {
    const country = await this.getCountryService.validateCountry(
      searchParams.country
    );
    const state = await this.getStateService.validateState(
      searchParams.state,
      country.id
    );
    return { country, state, city: null };
  }

  async validateAndConvertSearchByCity(
    searchParams: SearchNeighborhoodsInput
  ): Promise<ValidOutputSearchNeighborhood> {
    const country = await this.getCountryService.validateCountry(
      searchParams.country
    );
    const state = await this.getStateService.validateState(
      searchParams.state,
      country.id
    );
    const city = await this.getCityService.validateCity(
      searchParams.city,
      country.id,
      state.id
    );
    return { country, state, city };
  }
}
