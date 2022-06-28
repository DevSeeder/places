import { Injectable } from '@nestjs/common';
import { CitiesByCountry } from '../../../model/cities/cities-by-country.model';
import { CitiesMongoose } from '../../../../adapter/repository/cities/cities-mongoose.repository';
import { City } from '../../../schemas/city.schema';
import { ValidateCountryByNameOrAliasService } from '../../countries/validate-country-by-name-or-alias.service';
import { CitiesService } from '../cities.service';
import { CitiesByCountryBuilder } from '../../../../adapter/helper/builder/cities/cities-by-country.builder';

@Injectable()
export class GetCitiesByCountryService extends CitiesService {
  constructor(
    mongoRepository: CitiesMongoose,
    protected readonly validateCountryService: ValidateCountryByNameOrAliasService
  ) {
    super(mongoRepository);
  }

  async getCitiesByCountry(countryRef: string): Promise<CitiesByCountry> {
    const country = await this.validateCountryService.validateCountry(
      countryRef
    );

    this.logger.log('Searching cities in database...');

    const arrCities = await this.findCitiesByCountry(country.id);
    return new CitiesByCountryBuilder(arrCities).build();
  }

  async findCitiesByCountry(countryId: number): Promise<City[]> {
    const select = {
      _id: 0,
      id: 1,
      name: 1,
      countryId: 1,
      countryCode: 1,
      stateId: 1,
      stateName: 1,
      state: 1,
      stateCode: 1,
      city: 1,
      cityId: 1
    };

    return this.mongoRepository.findBySearchParams({ countryId }, select, {
      stateName: 1,
      name: 1
    });
  }
}
