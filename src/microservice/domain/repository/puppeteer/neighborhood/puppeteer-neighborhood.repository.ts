import { CheerioAPI } from 'cheerio';
import { NeighborhoodByCity } from '../../../model/neighborhoods/neighborhood-by-city.model';
import { SearchNeighborhoodsInput } from '../../../model/search/neighborhoods/search-neighborhoods-input.model';
import { PuppeteerRepository } from '../puppeteer.repository';
import { IPuppeteerNeighborhoodRepository } from '../../../interface/puppeteer/repository/puppeteer-neighborhood-repository.interface';
import { NotFoundException } from '../../../../../core/error-handling/exception/not-found.exception';
import { EnumTranslations } from 'src/microservice/domain/enumerators/enum-translations.enumerator';
import { ValidOutputSearchNeighborhood } from 'src/microservice/domain/interface/valid-output-search/valid-outpu-search-neighborhood.interface';

export abstract class PuppeteerNeighborhoodRepository
  extends PuppeteerRepository
  implements IPuppeteerNeighborhoodRepository
{
  language: EnumTranslations;
  async getNeighborhoodsByCity(
    searchParams: SearchNeighborhoodsInput,
    convertedSearch: ValidOutputSearchNeighborhood
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
    convertedSearch: ValidOutputSearchNeighborhood,
    _$: CheerioAPI
  );

  abstract callEndpoint(
    _searchParams: SearchNeighborhoodsInput
  ): Promise<CheerioAPI>;
}
