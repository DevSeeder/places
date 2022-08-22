import { Injectable } from '@nestjs/common';
import { CitiesMongoose } from '../../../adapter/repository/cities/cities-mongoose.repository';
import { CitiesService } from './cities.service';

@Injectable()
export class UpdateCityByIdService extends CitiesService {
  constructor(mongoRepository: CitiesMongoose) {
    super(mongoRepository);
  }

  async updateCityById(id: number, data: any): Promise<void> {
    return this.mongoRepository.updateById(id, data);
  }
}
