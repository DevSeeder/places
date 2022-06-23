import { Injectable } from '@nestjs/common';
import { CountriesMongoose } from '../../../adapter/repository/countries/countries-mongoose.repository';
import { Country } from '../../schemas/country.schema';
import { CountriesService } from './countries.service';

@Injectable()
export class GetCountryByNameOrAliasService extends CountriesService {
  constructor(mongoRepository: CountriesMongoose) {
    super(mongoRepository);
  }

  async getCountryByNameOrAlias(name: string): Promise<Country[]> {
    return this.mongoRepository.findByNameOrAlias(name);
  }
}
