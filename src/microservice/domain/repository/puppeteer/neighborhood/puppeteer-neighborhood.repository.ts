import { CheerioAPI } from 'cheerio';
import { NeighborhoodByCity } from '../../../model/neighborhoods/neighborhood-by-city.model';
import { SearchNeighborhoodsInput } from '../../../model/search/neighborhoods/search-neighborhoods-input.model';
import { PuppeteerRepository } from '../puppeteer.repository';
import { IPuppeteerNeighborhoodRepository } from '../../../interface/puppeteer/repository/puppeteer-neighborhood-repository.interface';
import { NotFoundException } from '../../../../../core/error-handling/exception/not-found.exception';
import { EnumTranslations } from '../../../enumerators/enum-translations.enumerator';
import { ValidOutputSearchByCity } from '../../../interface/valid-output-search/valid-outpu-search.interface';

export abstract class PuppeteerNeighborhoodRepository
  extends PuppeteerRepository
  implements IPuppeteerNeighborhoodRepository
{
  language: EnumTranslations;
  async getNeighborhoodsByCity(
    searchParams: SearchNeighborhoodsInput,
    convertedSearch: ValidOutputSearchByCity
  ): Promise<NeighborhoodByCity[]> {
    this.validateInput(searchParams);

    const $ = await this.callEndpoint(searchParams);
    const elements = this.buildElementsFromDocument(
      searchParams,
      convertedSearch,
      $
    );

    this.validateOutput(elements);

    return elements;
  }

  validateOutput(output: NeighborhoodByCity[]): void {
    if (output.length === 0) throw new NotFoundException('Neighborhoods');
  }

  abstract buildElementsFromDocument(
    _searchParams: SearchNeighborhoodsInput,
    convertedSearch: ValidOutputSearchByCity,
    _$: CheerioAPI
  );

  abstract callEndpoint(
    _searchParams: SearchNeighborhoodsInput
  ): Promise<CheerioAPI>;
}
