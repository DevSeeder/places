import { Inject, Injectable } from '@nestjs/common';
import { NeighborhoodByCity } from '../../../model/neighborhoods/neighborhood-by-city.model';
import { SearchNeighborhoodsInput } from '../../../model/search/search-neighborhoods-input.model';
import { NeighborhoodsMongoose } from '../../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { GuiaMaisRepository } from '../../../../adapter/repository/neighborhoods/puppeteer/guia-mais.repository';
import { SaveNeighborhoodsByCityService } from '../save-neighborhoods-by-city.service';
import { InvalidDataException } from '../../../../../core/error-handling/exception/invalid-data.exception';
import { ValidOutputSearchNeighborhood } from '../../../interface/valid-output-search/valid-outpu-search-neighborhood.interface';
import { GetCityByNameOrAliasService } from '../../cities/get-city-by-name-or-alias.service';
import { City } from '../../../schemas/city.schema';
import { SearchNeighborhoodsDB } from '../../../model/search/search-neighborhoods-db.model';
import { GetCountryByNameOrAliasService } from '../../countries/get-country-by-name-or-alias.service';
import { GetStateByNameOrAliasService } from '../../states/get-state-by-name-or-alias.service';
import { GetNeighborhoodsService } from './get-neighborhoods.service';

@Injectable()
export class GetNeighborhoodsByCityService extends GetNeighborhoodsService {
  constructor(
    @Inject('GuiaMaisRepository')
    private readonly guiaMaisRepository: GuiaMaisRepository,
    private readonly saveNeighborhoodsService: SaveNeighborhoodsByCityService,
    protected readonly getCountryService: GetCountryByNameOrAliasService,
    protected readonly getStateService: GetStateByNameOrAliasService,
    private readonly getCityService: GetCityByNameOrAliasService,
    mongoRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository, getCountryService, getStateService);
  }

  async getNeighborhoodsByCity(
    searchParams: SearchNeighborhoodsInput
  ): Promise<NeighborhoodByCity[]> {
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
  ): Promise<NeighborhoodByCity[]> {
    const searchDB = new SearchNeighborhoodsDB(
      convertedSearch.country.id,
      convertedSearch.state.id,
      convertedSearch.city.id
    );
    return this.findInDatabase(searchDB);
  }
}
