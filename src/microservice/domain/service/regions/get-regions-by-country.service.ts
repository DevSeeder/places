import { Injectable } from '@nestjs/common';
import { AbstractService } from '../abstract-service.service';
import { Country } from '../../schemas/country.schema';
import { StatesMongoose } from '../../../adapter/repository/states/states-mongoose.repository';
import { AggregatedRegionsByCountryDB } from '../../interface/aggregated/aggregated-regions-country.interface';
import { FinderDBService } from '../../interface/service/finder-db-service.interface';
import { RegionsByCountry } from '../../model/regions/regions-by-country.model';

@Injectable()
export class GetRegionsByCountryService
  extends AbstractService
  implements FinderDBService<Country, RegionsByCountry>
{
  constructor(protected readonly mongoRepository: StatesMongoose) {
    super();
  }

  async searchInDatabase(
    convertedSearch: Country
  ): Promise<RegionsByCountry[]> {
    const aggregated: AggregatedRegionsByCountryDB[] =
      await this.mongoRepository.aggregate(
        { _id: '$region' },
        { countryId: convertedSearch.id },
        {
          States: {
            $addToSet: '$name'
          }
        },
        'region'
      );

    return aggregated
      .map((item) => {
        return {
          name: item._id,
          states: item.States
        };
      })
      .filter((item) => {
        return item !== null;
      })
      .sort();
  }
}
