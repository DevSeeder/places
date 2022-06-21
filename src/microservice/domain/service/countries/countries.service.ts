import { CountriesMongoose } from 'src/microservice/adapter/repository/countries/countries-mongoose.repository';
import { AbstractService } from '../abstract-service.service';

export abstract class CountriesService extends AbstractService {
  constructor(protected readonly mongoRepository: CountriesMongoose) {
    super();
  }
}
