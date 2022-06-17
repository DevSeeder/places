import { SearchNeighborhoods } from 'src/microservice/domain/model/search/search-neighborhoods.model';
import { NeighborhoodsByCity } from '../../../domain/model/neighborhoods-by-city.model';
import {
  CitiesNeighborhood,
  Neighborhood,
  Neighborhoods,
  StatesNeighborhood
} from '../../../domain/schemas/neighborhood.schema';
import { MongoDBHelper } from '../mongodb.helper';

export class NeighborhoodsPuppeteerBuilder {
  constructor(private puppeteerResponse: NeighborhoodsByCity[]) {}

  build(searchParams: SearchNeighborhoods): Neighborhood {
    const obj = new Neighborhood();
    obj.country = searchParams.country;
    const state = new StatesNeighborhood();
    state.name = searchParams.state;
    const city = new CitiesNeighborhood();
    city.name = searchParams.city;
    city.neighborhoods = [];

    this.puppeteerResponse.forEach((item) => {
      const neighborhood = new Neighborhoods();
      neighborhood.name = item.name;
      neighborhood._id = MongoDBHelper.generateObjectID();
      city.neighborhoods.push(neighborhood);
    });

    state.cities = [city];
    obj.states = [state];
    return obj;
  }
}
