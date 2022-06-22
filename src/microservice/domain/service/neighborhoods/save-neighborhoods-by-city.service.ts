import { Injectable } from '@nestjs/common';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { NeighborhoodsMongoBuilder } from '../../../adapter/helper/builder/neighborhoods-mongo.builder';
import { SearchNeighborhoods } from '../../model/search/search-neighborhoods.model';
import { NeighborhoodsService } from './neighborhoods.service';
import { ValidOutputSearchNeighborhood } from '../../interface/valid-output-search/valid-outpu-search-neighborhood.interface';
import { Neighborhood } from '../../schemas/neighborhood.schema';

@Injectable()
export class SaveNeighborhoodsByCityService extends NeighborhoodsService {
  constructor(mongoRepository: NeighborhoodsMongoose) {
    super(mongoRepository);
  }

  async saveNeighborhoodsByCity(
    neighborhoodsPuppeteer: NeighborhoodsByCity[],
    searchParams: SearchNeighborhoods,
    convertedSearch: ValidOutputSearchNeighborhood
  ): Promise<void> {
    const arrDocument = new NeighborhoodsMongoBuilder(
      neighborhoodsPuppeteer
    ).build(searchParams);

    await this.mongoRepository.startTransaction();

    try {
      for await (const item of arrDocument) {
        const responseDB = await this.findNeighborhoodInDatabase(
          searchParams,
          item.name
        );

        if (responseDB.length === 0)
          await this.createNeighborhood(item, convertedSearch);
      }
    } catch (err) {
      this.mongoRepository.rollback();
      throw err;
    }

    await this.mongoRepository.commit();
  }

  async createNeighborhood(
    item: Neighborhood,
    convertedSearch: ValidOutputSearchNeighborhood
  ) {
    item.countryId = convertedSearch.country.id;
    item.country = convertedSearch.country.name.capitalize();
    item.stateId = convertedSearch.state.id;
    item.state = convertedSearch.state.stateCode.toUpperCase();
    item.cityId = convertedSearch.city.id;
    item.city = convertedSearch.city.name.capitalize();
    this.logger.log(`Saving neighborhood '${item.name}'...`);
    await this.mongoRepository.insertOne(item, item.name);
  }

  async findNeighborhoodInDatabase(
    searchParams: SearchNeighborhoods,
    name: string
  ) {
    searchParams.name = name;
    return this.findInDatabase(searchParams);
  }
}
