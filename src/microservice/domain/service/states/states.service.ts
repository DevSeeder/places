import { StatesMongoose } from '../../../adapter/repository/states/states-mongoose.repository';
import { AbstractService } from '../abstract-service.service';

export abstract class StatesService extends AbstractService {
  constructor(protected readonly mongoRepository: StatesMongoose) {
    super();
  }
}
