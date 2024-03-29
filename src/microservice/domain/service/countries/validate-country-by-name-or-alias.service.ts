import { Injectable, NotImplementedException } from '@nestjs/common';
import { InvalidDataException } from '../../../../core/error-handling/exception/invalid-data.exception';
import { CountriesMongoose } from '../../../adapter/repository/countries/countries-mongoose.repository';
import { Country } from '../../schemas/country.schema';
import { CountriesService } from './countries.service';

@Injectable()
export class ValidateCountryByNameOrAliasService extends CountriesService {
  constructor(mongoRepository: CountriesMongoose) {
    super(mongoRepository);
  }

  async getCountryByNameOrAlias(name: string): Promise<Country[]> {
    return this.mongoRepository.findByNameOrAliasOrId(name);
  }

  async validateCountry(
    country: string,
    implementationVerify = false
  ): Promise<Country> {
    this.logger.log(`Validating Country '${country}'...`);

    const res = await this.getCountryByNameOrAlias(country);
    if (res.length === 0) throw new InvalidDataException('Country', country);

    if (implementationVerify) this.validateCountryImplemented(res[0].id);

    this.logger.log(`Country: '${res[0].name}'`);
    return res[0];
  }

  protected validateCountryImplemented(countryId: number): void {
    if (countryId !== 31)
      throw new NotImplementedException('Country not supported!');
  }
}
