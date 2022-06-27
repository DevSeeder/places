import { City } from '../../schemas/city.schema';
import { Country } from '../../schemas/country.schema';
import { State } from '../../schemas/state.schema';

export interface ValidOutputSearchByCity {
  country: Country;
  state: State;
  city: City;
}

export interface ValidOutputSearchByState {
  country: Country;
  state: State;
}
