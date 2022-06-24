import { Injectable } from '@nestjs/common';
import { NeighborhoodsMongoose } from 'src/microservice/adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { CitiesMongoose } from '../../../adapter/repository/cities/cities-mongoose.repository';
import { AgregatedNeighborhoodsCity } from '../../interface/agregated/agregated-neighborhoods-city.interface';
import { SearchCitiesDB } from '../../model/search/search-cities-db.model';
import { City } from '../../schemas/city.schema';
import { CitiesService } from './cities.service';

@Injectable()
export class GetCitiesByStateService extends CitiesService {
  constructor(
    mongoRepository: CitiesMongoose,
    private mongoNeighborhoodsRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository);
  }

  async getCitiesByState(
    searchParams: SearchCitiesDB,
    arrIgnore = []
  ): Promise<City[]> {
    if (arrIgnore.length > 0) searchParams.cityId = { $nin: arrIgnore };
    return this.mongoRepository.findBySearchParams(searchParams);
  }

  async groupByCity(stateId: number): Promise<AgregatedNeighborhoodsCity[]> {
    return this.mongoNeighborhoodsRepository.groupBy(
      { cityId: '$cityId' },
      { stateId },
      { city: 'city' }
    );
  }
}
