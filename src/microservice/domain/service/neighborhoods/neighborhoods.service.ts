import { NeighborhoodsPuppeteerBuilder } from '../../../adapter/helper/builder/neighborhoods/neighborhoods-puppeteer.builder';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { SearchNeighborhoodsDB } from '../../model/search/search-neighborhoods-db.model';
import { AbstractService } from '../abstract-service.service';

export abstract class NeighborhoodsService extends AbstractService {
  constructor(protected readonly mongoRepository: NeighborhoodsMongoose) {
    super();
  }

  async findInDatabase(
    searchParamsDB: SearchNeighborhoodsDB
  ): Promise<NeighborhoodsByCity[]> {
    this.logger.log('Searching Neighborhood in database...');
    const res = await this.mongoRepository.findBySearchParams(searchParamsDB);
    return new NeighborhoodsPuppeteerBuilder(res).build();
  }
}
