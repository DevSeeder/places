import { Injectable } from '@nestjs/common';
import { NeighborhoodByCity } from '../../../model/neighborhoods/neighborhood-by-city.model';
import { NeighborhoodsMongoose } from '../../../../adapter/repository/neighborhoods/neighborhoods-mongoose.repository';
import { ValidOutputSearchByCity } from '../../../interface/valid-output-search/valid-outpu-search.interface';
import { SearchNeighborhoodsDB } from '../../../model/search/neighborhoods/search-neighborhoods-db.model';
import { NeighborhoodsService } from '../neighborhoods.service';
import { ValidateInputParamsService } from '../../validate/validate-input-params.service';
import { SeedNeighborhoodsByCityService } from '../../seed/neighborhoods/seed-neighborhoods-by-city.service';
import { FinderDBService } from '../../../interface/service/finder-db-service.interface';

@Injectable()
export class GetNeighborhoodsByCityService
  extends NeighborhoodsService
  implements FinderDBService<ValidOutputSearchByCity, NeighborhoodByCity>
{
  constructor(
    protected readonly validateService: ValidateInputParamsService,
    protected readonly seedNeighborhoodsByCity: SeedNeighborhoodsByCityService,
    mongoRepository: NeighborhoodsMongoose
  ) {
    super(mongoRepository);
  }

  async searchInDatabase(
    convertedSearch: ValidOutputSearchByCity
  ): Promise<NeighborhoodByCity[]> {
    const searchDB = new SearchNeighborhoodsDB(
      convertedSearch.country.id,
      convertedSearch.state.id,
      convertedSearch.city.id
    );
    return this.findInDatabase(searchDB);
  }
}
