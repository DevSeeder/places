import { ReferenceNeighborhoodsByState } from '../../../../domain/model/references/reference-neighborhoods-by-state.model';
import { City } from '../../../../domain/schemas/city.schema';
import { Country } from '../../../../domain/schemas/country.schema';
import { State } from '../../../../domain/schemas/state.schema';
import { Builder } from '../../../../domain/helper/builder/builder.builder';
import { ValidOutputSearchByCity } from '../../../../domain/interface/valid-output-search/valid-outpu-search.interface';

export class ValidOutputSearchByCityBuilder extends Builder<
  ReferenceNeighborhoodsByState,
  ValidOutputSearchByCity
> {
  build(): ValidOutputSearchByCity {
    const country = new Country();
    const state = new State();
    const city = new City();

    country.id = this.inputElement.countryId;
    country.name = this.inputElement.countryName;
    state.id = this.inputElement.stateId;
    state.name = this.inputElement.stateName;
    city.id = this.inputElement.cityId;
    city.name = this.inputElement.cityName;

    return {
      country,
      state,
      city
    };
  }
}
