import { Injectable } from '@nestjs/common';
import { SearchNeighborhoodsInput } from '../../../model/search/neighborhoods/search-neighborhoods-input.model';
import { NeighborhoodsMongoose } from '../../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { ValidOutputSearchNeighborhood } from '../../../interface/valid-output-search/valid-outpu-search-neighborhood.interface';
import { SearchNeighborhoodsDB } from '../../../model/search/neighborhoods/search-neighborhoods-db.model';
import {
  NeighborhoodsByState,
  NeighborhooodAggregatedByCity
} from '../../../model/neighborhoods/neighborhoods-by-state.model';
import { NeighborhoodsService } from '../neighborhoods.service';
import { ValidateInputParamsService } from '../../validate-input-params.service';
import { AggregatedNeighborhoodsByCity } from '../../../interface/aggregated/aggregated-neighborhoods-city.interface';

@Injectable()
export class GetNeighborhoodsByStateService extends NeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    mongoRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository);
  }

  async getNeighborhoodsByState(
    searchParams: SearchNeighborhoodsInput
  ): Promise<NeighborhoodsByState> {
    const convertedSearch =
      await this.validateService.validateAndConvertSearchByState(searchParams);

    return this.findNeighborhoodsByStateInDatabase(convertedSearch);
  }
  async findNeighborhoodsByStateInDatabase(
    convertedSearch: ValidOutputSearchNeighborhood
  ): Promise<NeighborhoodsByState> {
    const arrResponse: NeighborhoodsByState = {};

    this.logger.log(
      `Searching cities for state '${convertedSearch.state.stateCode}'...`
    );
    const aggregatedByCity = await this.groupByCity(convertedSearch.state.id);
    this.logger.log(`Founded cities: ${aggregatedByCity.length}`);
    for await (const item of aggregatedByCity) {
      const cityId = item._id.cityId;
      const arrNeighborhoods = await this.findByCityAndStateInDatabase(
        convertedSearch,
        cityId
      );

      this.logger.log(
        `City "${item.city}": ${arrNeighborhoods.length} Neighborhoods`
      );

      arrResponse[item.city] = arrNeighborhoods.map((neighborhood) => {
        const obj = new NeighborhooodAggregatedByCity();
        obj.name = neighborhood.name;
        obj.cityId = cityId;
        obj.state = `${convertedSearch.state.name} - ${convertedSearch.country.iso3}`;
        return obj;
      });
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

  async groupByCity(stateId: number): Promise<AggregatedNeighborhoodsByCity[]> {
    return this.mongoRepository.groupBy(
      { cityId: '$cityId' },
      { stateId },
      { city: 'city' }
    );
  }
}
