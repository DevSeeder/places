import { Injectable } from '@nestjs/common';
import { CountriesMongoose } from 'src/microservice/adapter/repository/countries/countries-mongoose.repository';
import { CountryResponse } from '../../model/countries/country-response.model';
import { CountriesService } from './countries.service';

@Injectable()
export class GetCountriesService extends CountriesService {
  constructor(mongoRepository: CountriesMongoose) {
    super(mongoRepository);
  }

  async getAll(): Promise<CountryResponse[]> {
    const select = {
      _id: 0,
      id: 1,
      name: 1,
      iso3: 1,
      iso2: 1,
      capital: 1,
      currency: 1,
      region: 1,
      subregion: 1,
      alias: 1,
      phoneCode: 1
    };
    return this.mongoRepository.findAll(select);
  }
}
