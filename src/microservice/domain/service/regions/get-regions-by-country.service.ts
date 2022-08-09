import { Injectable } from '@nestjs/common';
import { AbstractService } from '../abstract-service.service';
import { Country } from '../../schemas/country.schema';
import { StatesMongoose } from '../../../adapter/repository/states/states-mongoose.repository';
import { AggregatedRegionsByCountry } from '../../interface/aggregated/aggregated-regions-country.interface';
import { FinderDBService } from '../../interface/service/finder-db-service.interface';

@Injectable()
export class GetRegionsByCountryService
  extends AbstractService
  implements FinderDBService<Country, string>
{
  constructor(protected readonly mongoRepository: StatesMongoose) {
    super();
  }

  async searchInDatabase(convertedSearch: Country): Promise<string[]> {
    const aggregated: AggregatedRegionsByCountry[] =
      await this.mongoRepository.groupBy(
        { region: '$region' },
        { countryId: convertedSearch.id }
      );

    return aggregated
      .map((item) => {
        return item._id.region;
      })
      .filter((item) => {
        return item !== null;
      })
      .sort();
  }
}
