import { Injectable } from '@nestjs/common';
import { SearchNeighborhoodsDTO } from '../../../model/search/neighborhoods/search-neighborhoods-dto.model';
import { NeighborhoodsMongoose } from '../../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { ValidOutputSearchByState } from '../../../interface/valid-output-search/valid-outpu-search.interface';
import { SearchNeighborhoodsDB } from '../../../model/search/neighborhoods/search-neighborhoods-db.model';
import { NeighborhoodsByState } from '../../../model/neighborhoods/neighborhoods-by-state.model';
import { NeighborhoodsService } from '../neighborhoods.service';
import { ValidateInputParamsService } from '../../validate/validate-input-params.service';
import { AggregatedNeighborhoodsByCity } from '../../../interface/aggregated/aggregated-neighborhoods-city.interface';
import { NeighborhoodsByStateBuilder } from '../../../../adapter/helper/builder/neighborhoods/neighborhoods-by-state.builder';
import { Neighborhood } from '../../../schemas/neighborhood.schema';

@Injectable()
export class GetNeighborhoodsByStateService extends NeighborhoodsService {
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    mongoRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository);
  }

  async getNeighborhoodsByState(
    searchParams: SearchNeighborhoodsDTO
  ): Promise<NeighborhoodsByState> {
    const convertedSearch =
      await this.validateService.validateAndConvertSearchByState(
        searchParams,
        true
      );

    return this.findNeighborhoodsByStateInDatabase(convertedSearch);
  }

  async findNeighborhoodsByStateInDatabase(
    convertedSearch: ValidOutputSearchByState
  ): Promise<NeighborhoodsByState> {
    this.logger.log(
      `Searching Neighborhoods for state '${convertedSearch.state.stateCode}'...`
    );
    const arrByState = await this.findByStateInDatabase(convertedSearch);
    this.logger.log(`Founded Neighborhoods: ${arrByState.length}`);

    return new NeighborhoodsByStateBuilder(arrByState).build(convertedSearch);
  }

  async findByStateInDatabase(
    convertedSearch: ValidOutputSearchByState
  ): Promise<Neighborhood[]> {
    const searchDB = new SearchNeighborhoodsDB(
      convertedSearch.country.id,
      convertedSearch.state.id
    );
    return this.mongoRepository.findBySearchParams(
      searchDB,
      { _id: 0, name: 1, cityId: 1, state: 1, city: 1 },
      { city: 1, name: 1 }
    );
  }

  async groupByCity(stateId: number): Promise<AggregatedNeighborhoodsByCity[]> {
    return this.mongoRepository.groupBy(
      { cityId: '$cityId' },
      { stateId },
      { city: 'city' }
    );
  }
}
