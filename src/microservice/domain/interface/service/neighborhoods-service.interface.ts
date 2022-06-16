import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';

export interface INeighborhoodsService {
  getNeighborhoodsByCity(
    country: string,
    state: string,
    city: string
  ): Promise<NeighborhoodsByCity[]>;
}
