import { Injectable } from '@nestjs/common';
import { CitiesByCountry } from 'src/microservice/domain/model/cities/cities-by-country.model';
import { CitiesMongoose } from '../../../../adapter/repository/cities/cities-mongoose.repository';
import { SearchCitiesInput } from '../../../model/search/cities/search-cities-input.model';
import { City } from '../../../schemas/city.schema';
import { ValidateCountryByNameOrAliasService } from '../../countries/validate-country-by-name-or-alias.service';
import { CitiesService } from '../cities.service';

@Injectable()
export class GetCitiesByCountryService extends CitiesService {
  constructor(
    mongoRepository: CitiesMongoose,
    protected readonly validateCountryService: ValidateCountryByNameOrAliasService
  ) {
    super(mongoRepository);
  }

  async getCitiesByCountry(
    searchParams: SearchCitiesInput
  ): Promise<CitiesByCountry[]> {
    const country = await this.validateCountryService.validateCountry(
      searchParams.country
    );

    this.logger.log('Searching cities in database...');

    return this.findCitiesByCountry(country.id);
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
