import { NeighborhoodsPuppeteerBuilder } from '../../../adapter/helper/builder/neighborhoods-puppeteer.builder';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from '../../model/search/search-neighborhoods.model';

export abstract class NeighborhoodsService {
  constructor(protected readonly mongoRepository: NeighborhoodsMongoose) {}

  async findInDatabase(
    searchParams: SearchNeighborhoods
  ): Promise<NeighborhoodsByCity[]> {
    const res = await this.mongoRepository.findBySearchParams(searchParams);
    return new NeighborhoodsPuppeteerBuilder(res).build();
  }
}
