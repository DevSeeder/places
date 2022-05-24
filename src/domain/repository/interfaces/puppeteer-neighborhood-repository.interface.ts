import { SearchNeighborhoods } from 'src/domain/model/search-neighborhoods.model';
import { NeighborhoodsByCity } from '../../model/neighborhoods-by-city.model';
import { IPuppeteerRepository } from './puppeteer-repository.interface';

export interface PuppeteerNeighborhoodRepository
  extends IPuppeteerRepository<NeighborhoodsByCity, SearchNeighborhoods> {
  getNeighborhoodsByCity(
    searchParams: SearchNeighborhoods
  ): Promise<NeighborhoodsByCity[]>;
}
