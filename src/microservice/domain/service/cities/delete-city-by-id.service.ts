import { Injectable } from '@nestjs/common';
import { CitiesMongoose } from '../../../adapter/repository/cities/cities-mongoose.repository';
import { CitiesService } from './cities.service';

@Injectable()
export class DeleteCityByIdService extends CitiesService {
  constructor(mongoRepository: CitiesMongoose) {
    super(mongoRepository);
  }

  async deleteCityById(id: number): Promise<void> {
    await this.mongoRepository.deleteOneById(id);
  }
}
