import {
  NeighborhoodsByState,
  NeighborhooodAggregatedByCity
} from '../../../../domain/model/neighborhoods/neighborhoods-by-state.model';
import { Neighborhood } from '../../../../domain/schemas/neighborhood.schema';
import { Builder } from '../../../../domain/helper/builder/builder.builder';
import { ValidOutputSearchByState } from '../../../../domain/interface/valid-output-search/valid-outpu-search.interface';

export class NeighborhoodsByStateBuilder extends Builder<
  Neighborhood[],
  NeighborhoodsByState
> {
  constructor(inputElement: Neighborhood[]) {
    super(inputElement);
  }

  build(convertedSearch: ValidOutputSearchByState): NeighborhoodsByState {
    const builtElement = new NeighborhoodsByState();
    for (const item of this.inputElement) {
      const keyCity = item.city.capitalize();
      if (Object.keys(builtElement).includes(keyCity)) {
        const obj = new NeighborhooodAggregatedByCity();
        obj.name = item.name;
        obj.cityId = item.cityId;
        obj.state = `${convertedSearch.state.name} - ${convertedSearch.country.iso3}`;
        builtElement[keyCity].push(obj);
      } else builtElement[keyCity] = [];
    }
    return builtElement;
  }
}
