import { Injectable } from '@nestjs/common';
import { CitiesMongoose } from '../../../adapter/repository/cities/cities-mongoose.repository';
import { SearchCitiesDB } from '../../model/search/cities/search-cities-db.model';
import { SearchCitiesInput } from '../../model/search/cities/search-cities-input.model';
import { City } from '../../schemas/city.schema';
import { ValidateInputParamsService } from '../validate-input-params.service';
import { CitiesService } from './cities.service';

@Injectable()
export class GetCitiesByStateService extends CitiesService {
  constructor(
    mongoRepository: CitiesMongoose,
    protected readonly validateService: ValidateInputParamsService
  ) {
    super(mongoRepository);
  }

  async getCitiesByState(searchParams: SearchCitiesInput): Promise<City[]> {
    const convertedSearch =
      await this.validateService.validateAndConvertSearchByState(searchParams);

    const searchDB = new SearchCitiesDB(
      convertedSearch.country.id,
      convertedSearch.state.id
    );

    return this.findCitiesByState(searchDB);
  }

  async findCitiesByState(
    searchParams: SearchCitiesDB,
    arrIgnore = []
  ): Promise<City[]> {
    if (arrIgnore.length > 0) searchParams.id = { $nin: arrIgnore };
    return this.mongoRepository.findBySearchParams(searchParams);
  }
}
