import { Injectable } from '@nestjs/common';
import { InvalidDataException } from '../../../../core/error-handling/exception/invalid-data.exception';
import { CitiesMongoose } from '../../../adapter/repository/cities/cities-mongoose.repository';
import { City } from '../../schemas/city.schema';
import { CitiesService } from './cities.service';

@Injectable()
export class ValidateCityByNameOrAliasService extends CitiesService {
  constructor(mongoRepository: CitiesMongoose) {
    super(mongoRepository);
  }

  async getCityByNameOrAlias(
    name: string,
    countryId: number,
    stateId: number
  ): Promise<City[]> {
    return this.mongoRepository.findByNameOrAliasOrId(name, {
      countryId,
      stateId
    });
  }

  async validateCity(
    city: string,
    countryId: number,
    stateId: number
  ): Promise<City> {
    this.logger.log(`Validating City '${city}'...`);

    const res = await this.getCityByNameOrAlias(city, countryId, stateId);
    if (res.length === 0) throw new InvalidDataException('City', city);

    this.logger.log(`City: '${res[0].name}'`);
    return res[0];
  }
}
