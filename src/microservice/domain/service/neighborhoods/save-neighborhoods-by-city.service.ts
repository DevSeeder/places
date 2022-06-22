import { Injectable } from '@nestjs/common';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { NeighborhoodsMongoBuilder } from '../../../adapter/helper/builder/neighborhoods-mongo.builder';
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
    const arrDocument = new NeighborhoodsMongoBuilder(
      neighborhoodsPuppeteer
    ).build(searchParams);

    for await (const item of arrDocument) {
      const responseDB = await this.findNeighborhoodInDatabase(
        searchParams,
        item.name
      );

      if (responseDB.length === 0) {
        this.logger.log(`Saving neighborhood '${item.name}'...`);
        await this.mongoRepository.insertOne(item, item.name);
      }
    }
  }

  async findNeighborhoodInDatabase(
    searchParams: SearchNeighborhoods,
    name: string
  ) {
    searchParams.name = name;
    return this.findInDatabase(searchParams);
  }
}
