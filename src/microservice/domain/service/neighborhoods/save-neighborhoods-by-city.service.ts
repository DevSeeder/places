import { Injectable } from '@nestjs/common';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { NeighborhoodsPuppeteerBuilder } from '../../../adapter/helper/builder/neighborhoods-puppeteer.builder';
import { SearchNeighborhoods } from '../../model/search/search-neighborhoods.model';
import { NeighborhoodsService } from './neighborhoods.service';

@Injectable()
export class SaveNeighborhoodsByCityService extends NeighborhoodsService {
  constructor(mongoRepository: NeighborhoodsMongoose) {
    super(mongoRepository);
  }

  async saveNeighborhoodsByCity(
    neighborhoodsPuppeteer: NeighborhoodsByCity[],
    searchParams: SearchNeighborhoods
  ): Promise<void> {
    const arrDocument = new NeighborhoodsPuppeteerBuilder(
      neighborhoodsPuppeteer
    ).build(searchParams);

    arrDocument.forEach(async (item) => {
      const responseDB = await this.findNeighborhoodInDatabase(
        searchParams,
        item.name
      );

      if (responseDB.length === 0) await this.mongoRepository.insert(item);
    });
  }

  async findNeighborhoodInDatabase(
    searchParams: SearchNeighborhoods,
    name: string
  ) {
    searchParams.name = name;
    return this.findInDatabase(searchParams);
  }
}
