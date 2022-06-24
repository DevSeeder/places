import { SearchNeighborhoodsInput } from '../../../model/search/search-neighborhoods-input.model';
import { NeighborhoodByCity } from '../../../model/neighborhoods/neighborhood-by-city.model';
import { IPuppeteerRepository } from './puppeteer-repository.interface';

export interface IPuppeteerNeighborhoodRepository
  extends IPuppeteerRepository<NeighborhoodByCity, SearchNeighborhoodsInput> {
  getNeighborhoodsByCity(
    searchParams: SearchNeighborhoodsInput
  ): Promise<NeighborhoodByCity[]>;
}
