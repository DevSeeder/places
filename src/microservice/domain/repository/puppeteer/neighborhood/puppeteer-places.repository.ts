import { CheerioAPI } from 'cheerio';
import { PuppeteerRepository } from '../puppeteer.repository';
import { NotFoundException } from '../../../../../core/error-handling/exception/not-found.exception';
import { EnumTranslations } from '../../../enumerators/enum-translations.enumerator';
import { DTO } from '../../../../domain/model/dto.model';
import { PuppeteerService } from '../../../../domain/service/puppeteer/puppeteer.service';

export abstract class PuppeteerPlacesRepository<
  ElementPlace,
  SearchElement extends DTO,
  ValidOutputSearch
> extends PuppeteerRepository {
  language: EnumTranslations;

  constructor(
    protected url: string,
    protected puppeteerService: PuppeteerService,
    protected readonly elementName: string
  ) {
    super(puppeteerService);
  }

  async getElements(
    searchParams: SearchElement,
    convertedSearch: ValidOutputSearch
  ): Promise<ElementPlace[]> {
    this.validateInput(searchParams);

    const $ = await this.callEndpoint(searchParams, convertedSearch);
    const elements = this.buildElementsFromDocument(
      searchParams,
      convertedSearch,
      $
    );

    this.validateOutput(elements);

    return elements;
  }

  validateOutput(output: ElementPlace[]): void {
    if (output.length === 0) throw new NotFoundException(this.elementName);
  }

  abstract buildElementsFromDocument(
    _searchParams: SearchElement,
    convertedSearch: ValidOutputSearch,
    _$: CheerioAPI
  );

  abstract callEndpoint(
    _searchParams: SearchElement,
    _convertedSearch?: ValidOutputSearch
  ): Promise<CheerioAPI>;
}
