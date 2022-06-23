import { Inject, Injectable } from '@nestjs/common';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { SearchNeighborhoodsInput } from '../../model/search/search-neighborhoods-input.model';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { GuiaMaisRepository } from '../../../adapter/repository/neighborhoods/puppeteer/guia-mais.repository';
import { SaveNeighborhoodsByCityService } from './save-neighborhoods-by-city.service';
import { NeighborhoodsService } from './neighborhoods.service';
import { GetCountryByNameOrAliasService } from '../countries/get-country-by-name-or-alias.service';
import { InvalidDataException } from '../../../../core/error-handling/exception/invalid-data.exception';
import { GetStateByNameOrAliasService } from '../states/get-state-by-name-or-alias.service';
import { Country } from '../../schemas/country.schema';
import { State } from '../../schemas/state.schema';
import { ValidOutputSearchNeighborhood } from '../../interface/valid-output-search/valid-outpu-search-neighborhood.interface';
import { GetCityByNameOrAliasService } from '../cities/get-city-by-name-or-alias.service';
import { City } from '../../schemas/city.schema';
import { SearchNeighborhoodsDB } from '../../model/search/search-neighborhoods-db.model';

@Injectable()
export class GetNeighborhoodsByCityService extends NeighborhoodsService {
  constructor(
    @Inject('GuiaMaisRepository')
    private readonly guiaMaisRepository: GuiaMaisRepository,
    private readonly saveNeighborhoodsService: SaveNeighborhoodsByCityService,
    private readonly getCountryService: GetCountryByNameOrAliasService,
    private readonly getStateService: GetStateByNameOrAliasService,
    private readonly getCityService: GetCityByNameOrAliasService,
    mongoRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository);
  }

  async getNeighborhoodsByCity(
    country: string,
    state: string,
    city: string
  ): Promise<NeighborhoodsByCity[]> {
    const searchParams = new SearchNeighborhoodsInput(country, state, city);

    const convertedSearch = await this.validateAndConvertSearchParams(
      searchParams
    );

    const resMongo = await this.findNeighborhoodsByCityInDatabase(
      convertedSearch
    );

    if (resMongo.length === 0) {
      this.logger.log('Searching by puppeteer...');
      const resPuppeteer = await this.guiaMaisRepository.getNeighborhoodsByCity(
        searchParams
      );

      await this.saveNeighborhoodsService.saveNeighborhoodsByCity(
        resPuppeteer,
        searchParams,
        convertedSearch
      );

      this.logger.log('Returning Puppeteer response...');

      return resPuppeteer;
    }

    this.logger.log('Returning MongoDB response...');

    return resMongo;
  }

  async validateAndConvertSearchParams(
    searchParams: SearchNeighborhoodsInput
  ): Promise<ValidOutputSearchNeighborhood> {
    const country = await this.validateCountry(searchParams.country);
    const state = await this.validateState(searchParams.state, country.id);
    const city = await this.validateCity(
      searchParams.city,
      country.id,
      state.id
    );
    return { country, state, city };
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

  async validateCity(
    city: string,
    countryId: number,
    stateId: number
  ): Promise<City> {
    this.logger.log(`Validating City '${city}'...`);

    const res = await this.getCityService.getCityByNameOrAlias(
      city,
      countryId,
      stateId
    );
    if (res.length === 0) throw new InvalidDataException('City', city);

    this.logger.log(`City: '${res[0].name}'`);
    return res[0];
  }

  async findNeighborhoodsByCityInDatabase(
    convertedSearch: ValidOutputSearchNeighborhood
  ): Promise<NeighborhoodsByCity[]> {
    const searchDB = new SearchNeighborhoodsDB(
      convertedSearch.country.id,
      convertedSearch.state.id,
      convertedSearch.city.id
    );
    return this.findInDatabase(searchDB);
  }
}
