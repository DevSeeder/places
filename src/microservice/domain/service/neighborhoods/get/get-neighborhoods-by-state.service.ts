import { Injectable } from '@nestjs/common';
import { SearchNeighborhoodsInput } from '../../../model/search/search-neighborhoods-input.model';
import { NeighborhoodsMongoose } from '../../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { ValidOutputSearchNeighborhood } from '../../../interface/valid-output-search/valid-outpu-search-neighborhood.interface';
import { SearchNeighborhoodsDB } from '../../../model/search/search-neighborhoods-db.model';
import {
  NeighborhoodsByState,
  NeighborhooodAgregatedByCity
} from '../../../model/neighborhoods/neighborhoods-by-state.model';
import { NeighborhoodsService } from '../neighborhoods.service';
import { ValidateInputParamsService } from '../../validate-input-params.service';
import { GetCitiesByStateService } from '../../cities/get-cities-by-state.service';

@Injectable()
export class GetNeighborhoodsByStateService extends NeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    protected readonly getCitiesByStateService: GetCitiesByStateService,
    mongoRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository);
  }

  async getNeighborhoodsByState(
    searchParams: SearchNeighborhoodsInput
  ): Promise<NeighborhoodsByState> {
    const convertedSearch =
      await this.validateService.validateAndConvertSearchByState(searchParams);

    const resMongo = await this.findNeighborhoodsByStateInDatabase(
      convertedSearch
    );

    return resMongo;
  }

  async findNeighborhoodsByStateInDatabase(
    convertedSearch: ValidOutputSearchNeighborhood
  ): Promise<NeighborhoodsByState> {
    const arrResponse: NeighborhoodsByState = {};

    this.logger.log(
      `Searching cities for state '${convertedSearch.state.stateCode}'...`
    );
    const agregatedByCity = await this.getCitiesByStateService.groupByCity(
      convertedSearch.state.id
    );
    this.logger.log(`Founded cities: ${agregatedByCity.length}`);
    for await (const item of agregatedByCity) {
      const cityId = item._id.cityId;
      const arrNeighborhoods = await this.findByCityAndStateInDatabase(
        convertedSearch,
        cityId
      );

      this.logger.log(
        `City "${item.city}": ${arrNeighborhoods.length} Neighborhoods`
      );

      const arrAgregated = await arrNeighborhoods.map((neighborhood) => {
        const obj = new NeighborhooodAgregatedByCity();
        obj.name = neighborhood.name;
        obj.cityId = cityId;
        obj.state = `${convertedSearch.state.name} - ${convertedSearch.country.iso3}`;
        return obj;
      });

      arrResponse[item.city] = arrAgregated;
    }
    return arrResponse;
  }

  async findByCityAndStateInDatabase(
    convertedSearch: ValidOutputSearchNeighborhood,
    cityId: number
  ) {
    const searchDB = new SearchNeighborhoodsDB(
      convertedSearch.country.id,
      convertedSearch.state.id,
      cityId
    );
    return this.findInDatabase(searchDB);
  }
}
