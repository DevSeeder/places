import { Inject, Injectable } from '@nestjs/common';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from '../../model/search/search-neighborhoods.model';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { GuiaMaisRepository } from '../../../adapter/repository/neighborhoods/puppeteer/guia-mais.repository';
import { SaveNeighborhoodsByCityService } from './save-neighborhoods-by-city.service';
import { NeighborhoodsService } from './neighborhoods.service';
import { GetCountryByNameOrAliasService } from '../countries/get-country-by-name-or-alias.service';

@Injectable()
export class GetNeighborhoodsByCityService extends NeighborhoodsService {
  constructor(
    @Inject('GuiaMaisRepository')
    private readonly guiaMaisRepository: GuiaMaisRepository,
    private readonly saveNeighborhoodsService: SaveNeighborhoodsByCityService,
    private readonly getCountryService: GetCountryByNameOrAliasService,
    mongoRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository);
  }

  async getNeighborhoodsByCity(
    country: string,
    state: string,
    city: string
  ): Promise<NeighborhoodsByCity[]> {
    const searchParams = new SearchNeighborhoods(country, state, city);

    await this.validateAndFillSearchParams(searchParams);

    const resMongo = await this.findInDatabase(searchParams);

    if (!resMongo.length) {
      this.logger.log('Searching by puppeteer...');
      const resPuppeteer = await this.guiaMaisRepository.getNeighborhoodsByCity(
        searchParams
      );

      await this.saveNeighborhoodsService.saveNeighborhoodsByCity(
        resPuppeteer,
        searchParams
      );

      this.logger.log('Returning Puppeteer response...');

      return resPuppeteer;
    }

    this.logger.log('Returning MongoDB response...');

    return resMongo;
  }

  async validateAndFillSearchParams(searchParams: SearchNeighborhoods) {
    searchParams.country = await this.validateCountry(searchParams.country);
  }

  async validateCountry(country: string): Promise<string> {
    this.logger.log(`Validating Country '${country}'...`);

    const res = await this.getCountryService.getCountryByNameOrAlias(country);
    if (res.length === 0) throw new Error(`Invalid Country '${country}'`);

    this.logger.log(`Country: '${res[0].name}'`);
    return res[0].name;
  }
}
