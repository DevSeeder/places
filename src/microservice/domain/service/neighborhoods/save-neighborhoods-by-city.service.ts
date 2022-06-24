import { Injectable } from '@nestjs/common';
import { NeighborhoodByCity } from '../../model/neighborhoods/neighborhood-by-city.model';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { NeighborhoodsMongoBuilder } from '../../../adapter/helper/builder/neighborhoods/neighborhoods-mongo.builder';
import { SearchNeighborhoodsInput } from '../../model/search/search-neighborhoods-input.model';
import { NeighborhoodsService } from './neighborhoods.service';
import { ValidOutputSearchNeighborhood } from '../../interface/valid-output-search/valid-outpu-search-neighborhood.interface';
import { Neighborhood } from '../../schemas/neighborhood.schema';
import { SearchNeighborhoodsDBBuilder } from '../../../adapter/helper/builder/neighborhoods/search-neighborhoods-db.builder';

@Injectable()
export class SaveNeighborhoodsByCityService extends NeighborhoodsService {
  constructor(mongoRepository: NeighborhoodsMongoose) {
    super(mongoRepository);
  }

  async saveNeighborhoodsByCity(
    neighborhoodsPuppeteer: NeighborhoodByCity[],
    searchParams: SearchNeighborhoodsInput,
    convertedSearch: ValidOutputSearchNeighborhood
  ): Promise<void> {
    const arrDocument = new NeighborhoodsMongoBuilder(
      neighborhoodsPuppeteer
    ).build(convertedSearch);

    for await (const item of arrDocument) {
      const responseDB = await this.findNeighborhoodInDatabase(
        convertedSearch,
        item.name
      );

      if (responseDB.length === 0)
        await this.createNeighborhood(item, convertedSearch);
    }
  }

  async createNeighborhood(
    item: Neighborhood,
    convertedSearch: ValidOutputSearchNeighborhood
  ) {
    item.countryId = convertedSearch.country.id;
    item.country = convertedSearch.country.name.capitalize();
    item.stateId = convertedSearch.state.id;
    item.state = convertedSearch.state.stateCode.toUpperCase();
    item.stateName = convertedSearch.state.name.capitalize();
    item.cityId = convertedSearch.city.id;
    item.city = convertedSearch.city.name.capitalize();
    item.alias = [item.name];
    this.logger.log(`Saving neighborhood '${item.name}'...`);
    await this.mongoRepository.insertOne(item, item.name);
  }

  async findNeighborhoodInDatabase(
    convertedSearch: ValidOutputSearchNeighborhood,
    name: string
  ) {
    const searchParams = new SearchNeighborhoodsDBBuilder(
      convertedSearch
    ).build();
    searchParams.name = name;

    return this.findInDatabase(searchParams);
  }
}
