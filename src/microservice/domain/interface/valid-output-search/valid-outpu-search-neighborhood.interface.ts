import { City } from '../../schemas/city.schema';
import { Country } from '../../schemas/country.schema';
import { State } from '../../schemas/state.schema';

export interface ValidOutputSearchNeighborhood {
  country: Country;
  state: State;
  city: City;
}