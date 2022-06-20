import { NeighborhoodsByCity } from '../../../domain/model/neighborhoods-by-city.model';
import { Neighborhood } from '../../../domain/schemas/neighborhood.schema';

export class NeighborhoodsPuppeteerBuilder {
  constructor(private readonly mongoResponse: Neighborhood[]) {}

  build(): NeighborhoodsByCity[] {
    const arr = [];
    this.mongoResponse.forEach((document) => {
      const obj = new NeighborhoodsByCity();
      obj.city = `${document.city.capitalize()} - ${document.state.toUpperCase()}`;
      obj.name = document.name;
      arr.push(obj);
    });
    return arr;
  }
}
