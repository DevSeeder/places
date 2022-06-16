import { NeighborhoodsByCity } from '../../../domain/model/neighborhoods-by-city.model';
import { Neighborhood } from '../../../domain/schemas/neighborhood.schema';

export class NeighborhoodsMongoBuilder {
  constructor(private mongoResponse: Neighborhood[]) {}

  build(): NeighborhoodsByCity[] {
    const arr = [];
    this.mongoResponse.forEach((country) => {
      country.states.forEach((state) => {
        state.cities.forEach((city) => {
          city.neighborhoods.forEach((item) => {
            const obj = new NeighborhoodsByCity();
            obj.city = `${city.name.capitalize()} - ${state.name.toUpperCase()}`;
            obj.name = item.name;
            arr.push(obj);
          });
        });
      });
    });
    return arr;
  }
}
