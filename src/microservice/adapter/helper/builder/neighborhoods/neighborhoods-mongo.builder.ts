import { ValidOutputSearchByCity } from '../../../../domain/interface/valid-output-search/valid-outpu-search.interface';
import { NeighborhoodByCity } from '../../../../domain/model/neighborhoods/neighborhood-by-city.model';
import { Neighborhood } from '../../../../domain/schemas/neighborhood.schema';

export class NeighborhoodsMongoBuilder {
  constructor(private readonly puppeteerResponse: NeighborhoodByCity[]) {}

  build(searchParams: ValidOutputSearchByCity): Neighborhood[] {
    const arr = [];

    this.puppeteerResponse.forEach((item) => {
      const obj = new Neighborhood();
      obj.countryId = searchParams.country.id;
      obj.country = searchParams.country.name;
      obj.stateId = searchParams.state.id;
      obj.state = searchParams.state.stateCode;
      obj.cityId = searchParams.city.id;
      obj.city = searchParams.city.name;
      obj.name = item.name;
      arr.push(obj);
    });

    return arr;
  }
}
