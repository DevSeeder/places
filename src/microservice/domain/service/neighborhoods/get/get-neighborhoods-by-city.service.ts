import { Injectable } from '@nestjs/common';
import { NeighborhoodByCity } from '../../../model/neighborhoods/neighborhood-by-city.model';
import { SearchNeighborhoodsDTO } from '../../../model/search/neighborhoods/search-neighborhoods-dto.model';
import { NeighborhoodsMongoose } from '../../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { ValidOutputSearchByCity } from '../../../interface/valid-output-search/valid-outpu-search.interface';
import { SearchNeighborhoodsDB } from '../../../model/search/neighborhoods/search-neighborhoods-db.model';
import { NeighborhoodsService } from '../neighborhoods.service';
import { ValidateInputParamsService } from '../../validate/validate-input-params.service';
import { SeedNeighborhoodsByCityService } from '../../seed/neighborhoods/seed-neighborhoods-by-city.service';

@Injectable()
export class GetNeighborhoodsByCityService extends NeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    protected readonly seedNeighborhoodsByCity: SeedNeighborhoodsByCityService,
    mongoRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository);
  }

  async getNeighborhoodsByCity(
    searchParams: SearchNeighborhoodsDTO
  ): Promise<NeighborhoodByCity[]> {
    const convertedSearch =
      await this.validateService.validateAndConvertSearchByCity(searchParams);

    const resMongo = await this.findNeighborhoodsByCityInDatabase(
      convertedSearch
    );

    if (resMongo.length === 0) {
      this.logger.log('Searching by puppeteer...');
      const resPuppeteer =
        await this.seedNeighborhoodsByCity.searchByPuppeterAndSave(
          searchParams,
          convertedSearch
        );

      this.logger.log('Returning Puppeteer response...');
      return resPuppeteer;
    }

    this.logger.log('Returning MongoDB response...');

    return resMongo;
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
