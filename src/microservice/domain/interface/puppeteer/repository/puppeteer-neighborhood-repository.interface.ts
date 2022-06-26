import { SearchNeighborhoodsInput } from '../../../model/search/neighborhoods/search-neighborhoods-input.model';
import { NeighborhoodByCity } from '../../../model/neighborhoods/neighborhood-by-city.model';
import { IPuppeteerRepository } from './puppeteer-repository.interface';
import { EnumTranslations } from 'src/microservice/domain/enumerators/enum-translations.enumerator';

export interface IPuppeteerNeighborhoodRepository
  extends IPuppeteerRepository<NeighborhoodByCity, SearchNeighborhoodsInput> {
  language: EnumTranslations;
  getNeighborhoodsByCity(
    searchParams: SearchNeighborhoodsInput
  ): Promise<NeighborhoodByCity[]>;
}
