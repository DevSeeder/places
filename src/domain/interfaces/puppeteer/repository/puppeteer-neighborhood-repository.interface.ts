import { SearchNeighborhoods } from 'src/domain/model/search/search-neighborhoods.model';
import { NeighborhoodsByCity } from '../../../model/neighborhoods-by-city.model';
import { IPuppeteerRepository } from './puppeteer-repository.interface';

export interface IPuppeteerNeighborhoodRepository
  extends IPuppeteerRepository<NeighborhoodsByCity, SearchNeighborhoods> {
  getNeighborhoodsByCity(
    searchParams: SearchNeighborhoods
  ): Promise<NeighborhoodsByCity[]>;
}
