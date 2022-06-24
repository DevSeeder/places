import { NeighborhoodByCity } from '../../../../domain/model/neighborhoods/neighborhood-by-city.model';
import { Neighborhood } from '../../../../domain/schemas/neighborhood.schema';

export class NeighborhoodsPuppeteerBuilder {
  constructor(private readonly mongoResponse: Neighborhood[]) {}

  build(): NeighborhoodByCity[] {
    const arr = [];
    this.mongoResponse.forEach((document) => {
      const obj = new NeighborhoodByCity();
      obj.city = `${document.city.capitalize()} - ${document.state.toUpperCase()}`;
      obj.name = document.name;
      arr.push(obj);
    });
    return arr;
  }
}
