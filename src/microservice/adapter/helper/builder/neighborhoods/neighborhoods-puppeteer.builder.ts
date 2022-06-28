import { Builder } from '../../../../domain/helper/builder/builder.builder';
import { NeighborhoodByCity } from '../../../../domain/model/neighborhoods/neighborhood-by-city.model';
import { Neighborhood } from '../../../../domain/schemas/neighborhood.schema';

export class NeighborhoodsPuppeteerBuilder extends Builder<
  Neighborhood[],
  NeighborhoodByCity[]
> {
  constructor(inputElement: Neighborhood[]) {
    super(inputElement);
  }

  build(): NeighborhoodByCity[] {
    const arr = [];
    this.inputElement.forEach((document) => {
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
