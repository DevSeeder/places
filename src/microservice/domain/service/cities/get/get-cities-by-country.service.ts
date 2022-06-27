import { Injectable } from '@nestjs/common';
import { CitiesResponse } from 'src/microservice/domain/model/cities/cities-by-state.model';
import { CitiesMongoose } from '../../../../adapter/repository/cities/cities-mongoose.repository';
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

  async getCitiesByCountry(countryRef: string): Promise<CitiesResponse[]> {
    const country = await this.validateCountryService.validateCountry(
      countryRef
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
