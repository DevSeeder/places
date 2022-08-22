import { CheerioAPI } from 'cheerio';

export interface IPuppeteerRepository<
  ElementPlace,
  SearchElement,
  ValidOutputSearch
> {
  callEndpoint(
    searchParams: SearchElement,
    convertedSearch?: ValidOutputSearch
  ): Promise<CheerioAPI>;

  getDocumentHtml(url: string): Promise<CheerioAPI>;

  buildElementsFromDocument(
    searchParams: SearchElement,
    convertedSearch: ValidOutputSearch,
    $: CheerioAPI
  ): Promise<ElementPlace[]>;

  validateInput(searchParams: SearchElement): void;

  validateOutput(output: ElementPlace[]): void;
}
