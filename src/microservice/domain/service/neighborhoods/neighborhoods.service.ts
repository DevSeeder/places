import { NeighborhoodsPuppeteerBuilder } from '../../../adapter/helper/builder/neighborhoods-puppeteer.builder';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from '../../model/search/search-neighborhoods.model';
import { AbstractService } from '../abstract-service.service';

export abstract class NeighborhoodsService extends AbstractService {
  constructor(protected readonly mongoRepository: NeighborhoodsMongoose) {
    super();
  }

  async findInDatabase(
    searchParams: SearchNeighborhoods
  ): Promise<NeighborhoodsByCity[]> {
    this.logger.log('Searching in database...');
    const res = await this.mongoRepository.findBySearchParams(searchParams);
    return new NeighborhoodsPuppeteerBuilder(res).build();
  }
}
