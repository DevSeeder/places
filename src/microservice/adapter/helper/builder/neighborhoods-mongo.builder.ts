import { SearchNeighborhoods } from 'src/microservice/domain/model/search/search-neighborhoods.model';
import { NeighborhoodsByCity } from '../../../domain/model/neighborhoods-by-city.model';
import { Neighborhood } from '../../../domain/schemas/neighborhood.schema';

export class NeighborhoodsMongoBuilder {
  constructor(private readonly puppeteerResponse: NeighborhoodsByCity[]) {}

  build(searchParams: SearchNeighborhoods): Neighborhood[] {
    const arr = [];

    this.puppeteerResponse.forEach((item) => {
      const obj = new Neighborhood();
      obj.country = searchParams.country;
      obj.state = searchParams.state;
      obj.city = searchParams.city;
      obj.name = item.name;
      arr.push(obj);
    });

    return arr;
  }
}
