import { CitiesMongoose } from '../../../adapter/repository/cities/cities-mongoose.repository';
import { AbstractService } from '../abstract-service.service';

export abstract class CitiesService extends AbstractService {
  constructor(protected readonly mongoRepository: CitiesMongoose) {
    super();
  }
}
