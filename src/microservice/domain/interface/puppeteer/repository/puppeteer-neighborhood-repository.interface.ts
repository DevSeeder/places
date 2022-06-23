import { SearchNeighborhoodsInput } from '../../../model/search/search-neighborhoods-input.model';
import { NeighborhoodsByCity } from '../../../model/neighborhoods-by-city.model';
import { IPuppeteerRepository } from './puppeteer-repository.interface';

export interface IPuppeteerNeighborhoodRepository
  extends IPuppeteerRepository<NeighborhoodsByCity, SearchNeighborhoodsInput> {
  getNeighborhoodsByCity(
    searchParams: SearchNeighborhoodsInput
  ): Promise<NeighborhoodsByCity[]>;
}
