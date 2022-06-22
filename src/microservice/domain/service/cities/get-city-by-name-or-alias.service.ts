import { Injectable } from '@nestjs/common';
import { CitiesMongoose } from '../../../adapter/repository/cities/cities-mongoose.repository';
import { City } from '../../schemas/city.schema';
import { CitiesService } from './cities.service';

@Injectable()
export class GetCityByNameOrAliasService extends CitiesService {
  constructor(mongoRepository: CitiesMongoose) {
    super(mongoRepository);
  }

  async getCityByNameOrAlias(
    name: string,
    countryId: number,
    stateId: number
  ): Promise<City[]> {
    return this.mongoRepository.findByNameOrAlias(name, { countryId, stateId });
  }
}
