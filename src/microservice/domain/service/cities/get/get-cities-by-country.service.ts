import { Injectable } from '@nestjs/common';
import { CitiesByCountry } from 'src/microservice/domain/model/cities/cities-by-country.model';
import { CitiesMongoose } from '../../../../adapter/repository/cities/cities-mongoose.repository';
import { SearchCitiesDB } from '../../../model/search/cities/search-cities-db.model';
import { SearchCitiesInput } from '../../../model/search/cities/search-cities-input.model';
import { City } from '../../../schemas/city.schema';
import { ValidateInputParamsService } from '../../validate/validate-input-params.service';
import { CitiesService } from '../cities.service';

@Injectable()
export class GetCitiesByCountryService extends CitiesService {
  constructor(
    mongoRepository: CitiesMongoose,
    protected readonly validateService: ValidateInputParamsService
  ) {
    super(mongoRepository);
  }

  async getCitiesByCountry(
    searchParams: SearchCitiesInput
  ): Promise<CitiesByCountry[]> {
    const convertedSearch =
      await this.validateService.validateAndConvertSearchByState(searchParams);

    this.logger.log('Searching cities in database...');

    return this.findCitiesByCountry(convertedSearch.country.id);
  }

  async findCitiesByCountry(countryId: number): Promise<City[]> {
    const select = {
      _id: 0,
      id: 1,
      name: 1,
      countryId: 1,
      countryCode: 1,
      stateId: 1,
      state: 1,
      stateCode: 1,
      city: 1,
      cityId: 1
    };

    return this.mongoRepository.findBySearchParams({ countryId }, select);
  }
}
