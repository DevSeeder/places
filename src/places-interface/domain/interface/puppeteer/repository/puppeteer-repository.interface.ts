import { CheerioAPI } from 'cheerio';

export interface IPuppeteerRepository<ElementPlace, SearchElement> {
  callEndpoint(searchParams: SearchElement): Promise<CheerioAPI>;

  getDocumentHtml(url: string): Promise<CheerioAPI>;

  getDataHtml(): Promise<string>;

  goToUrl(url: string): Promise<void>;

  buildElementFromDocument(
    searchParams: SearchElement,
    $: CheerioAPI
  ): ElementPlace[];
}
