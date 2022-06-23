import { ValidOutputSearchNeighborhood } from 'src/microservice/domain/interface/valid-output-search/valid-outpu-search-neighborhood.interface';
import { NeighborhoodsByCity } from '../../../../domain/model/neighborhoods-by-city.model';
import { Neighborhood } from '../../../../domain/schemas/neighborhood.schema';

export class NeighborhoodsMongoBuilder {
  constructor(private readonly puppeteerResponse: NeighborhoodsByCity[]) {}

  build(searchParams: ValidOutputSearchNeighborhood): Neighborhood[] {
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
