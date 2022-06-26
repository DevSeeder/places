import { SearchNeighborhoodsInput } from '../../../model/search/neighborhoods/search-neighborhoods-input.model';
import { NeighborhoodByCity } from '../../../model/neighborhoods/neighborhood-by-city.model';
import { IPuppeteerRepository } from './puppeteer-repository.interface';
import { EnumTranslations } from 'src/microservice/domain/enumerators/enum-translations.enumerator';
import { ValidOutputSearchNeighborhood } from '../../valid-output-search/valid-outpu-search-neighborhood.interface';

export interface IPuppeteerNeighborhoodRepository
  extends IPuppeteerRepository<
    NeighborhoodByCity,
    SearchNeighborhoodsInput,
    ValidOutputSearchNeighborhood
  > {
  language: EnumTranslations;
  getNeighborhoodsByCity(
    searchParams: SearchNeighborhoodsInput,
    convertedSearch: ValidOutputSearchNeighborhood
  ): Promise<NeighborhoodByCity[]>;
}
