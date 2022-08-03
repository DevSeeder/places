import { Injectable } from '@nestjs/common';
import { NeighborhoodByCity } from '../../model/neighborhoods/neighborhood-by-city.model';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { NeighborhoodsMongoBuilder } from '../../../adapter/helper/builder/neighborhoods/neighborhoods-mongo.builder';
import { SearchNeighborhoodsDTO } from '../../model/search/neighborhoods/search-neighborhoods-dto.model';
import { NeighborhoodsService } from './neighborhoods.service';
import { ValidOutputSearchByCity } from '../../interface/valid-output-search/valid-outpu-search.interface';
import { Neighborhood } from '../../schemas/neighborhood.schema';
import { SearchNeighborhoodsDBBuilder } from '../../../adapter/helper/builder/neighborhoods/search-neighborhoods-db.builder';

@Injectable()
export class SaveNeighborhoodsByCityService extends NeighborhoodsService {
  constructor(mongoRepository: NeighborhoodsMongoose) {
    super(mongoRepository);
  }

  async saveNeighborhoodsByCity(
    neighborhoodsPuppeteer: NeighborhoodByCity[],
    searchParams: SearchNeighborhoodsDTO,
    convertedSearch: ValidOutputSearchByCity
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
    convertedSearch: ValidOutputSearchByCity
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
    convertedSearch: ValidOutputSearchByCity,
    name: string
  ) {
    const searchParams = new SearchNeighborhoodsDBBuilder(
      convertedSearch
    ).build();
    searchParams.name = name;

    return this.findInDatabase(searchParams);
  }
}
