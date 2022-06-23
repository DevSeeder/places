import { ValidOutputSearchNeighborhood } from '../../../../domain/interface/valid-output-search/valid-outpu-search-neighborhood.interface';
import { SearchNeighborhoodsDB } from '../../../../domain/model/search/search-neighborhoods-db.model';

export class SearchNeighborhoodsDBBuilder {
  constructor(
    private readonly convertedSearch: ValidOutputSearchNeighborhood
  ) {}

  build(): SearchNeighborhoodsDB {
    return new SearchNeighborhoodsDB(
      this.convertedSearch.country.id,
      this.convertedSearch.state.id,
      this.convertedSearch.city.id
    );
  }
}