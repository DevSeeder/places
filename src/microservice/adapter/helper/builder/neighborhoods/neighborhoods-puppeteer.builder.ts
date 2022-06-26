import { NeighborhoodByCity } from '../../../../domain/model/neighborhoods/neighborhood-by-city.model';
import { Neighborhood } from '../../../../domain/schemas/neighborhood.schema';

export class NeighborhoodsPuppeteerBuilder {
  constructor(private readonly mongoResponse: Neighborhood[]) {}

  build(): NeighborhoodByCity[] {
    const arr = [];
    this.mongoResponse.forEach((document) => {
      const obj = new NeighborhoodByCity();
      obj.name = document.name;
      obj.cityId = document.cityId;
      obj.city = `${document.city.capitalize()} - ${document.state.toUpperCase()}`;
      obj.stateId = document.stateId;
      obj.countryId = document.countryId;
      arr.push(obj);
    });
    return arr;
  }
}
