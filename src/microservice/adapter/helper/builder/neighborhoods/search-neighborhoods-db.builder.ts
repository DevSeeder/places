import { Builder } from '../../../../domain/helper/builder/builder.builder';
import { ValidOutputSearchByCity } from '../../../../domain/interface/valid-output-search/valid-outpu-search.interface';
import { SearchNeighborhoodsDB } from '../../../../domain/model/search/neighborhoods/search-neighborhoods-db.model';

export class SearchNeighborhoodsDBBuilder extends Builder<
  ValidOutputSearchByCity,
  SearchNeighborhoodsDB
> {
  constructor(inputElement: ValidOutputSearchByCity) {
    super(inputElement);
  }

  build(): SearchNeighborhoodsDB {
    return new SearchNeighborhoodsDB(
      this.inputElement.country.id,
      this.inputElement.state.id,
      this.inputElement.city.id
    );
  }
}
