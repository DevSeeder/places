import { Injectable } from '@nestjs/common';
import { NeighborhoodsMongoose } from '../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { CitiesMongoose } from '../../../adapter/repository/cities/cities-mongoose.repository';
import { AggregatedNeighborhoodsCity } from '../../interface/aggregated/aggregated-neighborhoods-city.interface';
import { SearchCitiesDB } from '../../model/search/search-cities-db.model';
import { City } from '../../schemas/city.schema';
import { CitiesService } from './cities.service';

@Injectable()
export class GetCitiesByStateService extends CitiesService {
  constructor(
    mongoRepository: CitiesMongoose,
    private readonly mongoNeighborhoodsRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository);
  }

  async getCitiesByState(
    searchParams: SearchCitiesDB,
    arrIgnore = []
  ): Promise<City[]> {
    if (arrIgnore.length > 0) searchParams.id = { $nin: arrIgnore };
    return this.mongoRepository.findBySearchParams(searchParams);
  }

  async groupByCity(stateId: number): Promise<AggregatedNeighborhoodsCity[]> {
    return this.mongoNeighborhoodsRepository.groupBy(
      { cityId: '$cityId' },
      { stateId },
      { city: 'city' }
    );
  }
}
