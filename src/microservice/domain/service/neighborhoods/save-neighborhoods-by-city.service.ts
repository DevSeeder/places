import { Injectable } from '@nestjs/common';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { NeighborhoodsPuppeteerBuilder } from '../../../adapter/helper/builder/neighborhoods-puppeteer.builder';
import { SearchNeighborhoods } from '../../model/search/search-neighborhoods.model';

@Injectable()
export class SaveNeighborhoodsByCityService {
  constructor(private readonly mongoRepository: NeighborhoodsMongoose) {}

  async saveNeighborhoodsByCity(
    neighborhoodsPuppeteer: NeighborhoodsByCity[],
    searchParams: SearchNeighborhoods
  ): Promise<void> {
    const obj = new NeighborhoodsPuppeteerBuilder(neighborhoodsPuppeteer).build(
      searchParams
    );
    await this.mongoRepository.insert(obj);
  }
}
