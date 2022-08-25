import { Injectable } from '@nestjs/common';
import { SearchNeighborhoodsDTO } from '../../model/search/neighborhoods/search-neighborhoods-dto.model';
import {
  ValidOutputSearchByCity,
  ValidOutputSearchByState
} from '../../interface/valid-output-search/valid-outpu-search.interface';
import { AbstractService } from '../abstract-service.service';
import { ValidateCountryByNameOrAliasService } from '../countries/validate-country-by-name-or-alias.service';
import { ValidateStateByNameOrAliasService } from '../states/validate-state-by-name-or-alias.service';
import { ValidateCityByNameOrAliasService } from '../cities/validate-city-by-name-or-alias.service';
import { SearchCitiesDTO } from '../../model/search/cities/search-cities-dto.model';

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
    searchParams: SearchNeighborhoodsDTO | SearchCitiesDTO,
    implementationVerify = false
  ): Promise<ValidOutputSearchByState> {
    const country = await this.getCountryService.validateCountry(
      searchParams.country,
      implementationVerify
    );
    const state = await this.getStateService.validateState(
      searchParams.state,
      country.id
    );
    return { country, state };
  }

  async validateAndConvertSearchByCity(
    searchParams: SearchNeighborhoodsDTO,
    implementationVerify = false
  ): Promise<ValidOutputSearchByCity> {
    const country = await this.getCountryService.validateCountry(
      searchParams.country,
      implementationVerify
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
