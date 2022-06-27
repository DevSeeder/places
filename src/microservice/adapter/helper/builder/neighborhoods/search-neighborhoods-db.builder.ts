import { ValidOutputSearchByCity } from '../../../../domain/interface/valid-output-search/valid-outpu-search.interface';
import { SearchNeighborhoodsDB } from '../../../../domain/model/search/neighborhoods/search-neighborhoods-db.model';

export class SearchNeighborhoodsDBBuilder {
  constructor(private readonly convertedSearch: ValidOutputSearchByCity) {}

  build(): SearchNeighborhoodsDB {
    return new SearchNeighborhoodsDB(
      this.convertedSearch.country.id,
      this.convertedSearch.state.id,
      this.convertedSearch.city.id
    );
  }
}
