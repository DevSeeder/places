import { Inject, Injectable } from '@nestjs/common';
import { NeighborhoodByCity } from '../../../model/neighborhoods/neighborhood-by-city.model';
import { SearchNeighborhoodsInput } from '../../../model/search/neighborhoods/search-neighborhoods-input.model';
import { NeighborhoodsMongoose } from '../../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { GuiaMaisRepository } from '../../../../adapter/repository/neighborhoods/puppeteer/guia-mais.repository';
import { SaveNeighborhoodsByCityService } from '../save-neighborhoods-by-city.service';
import { ValidOutputSearchByCity } from '../../../interface/valid-output-search/valid-outpu-search.interface';
import { SearchNeighborhoodsDB } from '../../../model/search/neighborhoods/search-neighborhoods-db.model';
import { NeighborhoodsService } from '../neighborhoods.service';
import { ValidateInputParamsService } from '../../validate/validate-input-params.service';

@Injectable()
export class GetNeighborhoodsByCityService extends NeighborhoodsService {
  constructor(
    @Inject('GuiaMaisRepository')
    private readonly guiaMaisRepository: GuiaMaisRepository,
    private readonly saveNeighborhoodsService: SaveNeighborhoodsByCityService,
    protected readonly validateService: ValidateInputParamsService,
    mongoRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository);
  }

  async getNeighborhoodsByCity(
    searchParams: SearchNeighborhoodsInput
  ): Promise<NeighborhoodByCity[]> {
    const convertedSearch =
      await this.validateService.validateAndConvertSearchByCity(searchParams);

    const resMongo = await this.findNeighborhoodsByCityInDatabase(
      convertedSearch
    );

    if (resMongo.length === 0) {
      this.logger.log('Searching by puppeteer...');
      const resPuppeteer = await this.searchByPuppeterAndSave(
        searchParams,
        convertedSearch
      );

      this.logger.log('Returning Puppeteer response...');
      return resPuppeteer;
    }

    this.logger.log('Returning MongoDB response...');

    return resMongo;
  }

  async searchByPuppeterAndSave(
    searchParams: SearchNeighborhoodsInput,
    convertedSearch: ValidOutputSearchByCity
  ): Promise<NeighborhoodByCity[]> {
    const resPuppeteer = await this.guiaMaisRepository.getNeighborhoodsByCity(
      searchParams,
      convertedSearch
    );

    await this.saveNeighborhoodsService.saveNeighborhoodsByCity(
      resPuppeteer,
      searchParams,
      convertedSearch
    );

    return resPuppeteer;
  }

  async findNeighborhoodsByCityInDatabase(
    convertedSearch: ValidOutputSearchByCity
  ): Promise<NeighborhoodByCity[]> {
    const searchDB = new SearchNeighborhoodsDB(
      convertedSearch.country.id,
      convertedSearch.state.id,
      convertedSearch.city.id
    );
    return this.findInDatabase(searchDB);
  }
}
