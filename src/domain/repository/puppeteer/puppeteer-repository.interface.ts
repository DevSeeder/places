import { CheerioAPI } from 'cheerio';

export interface IPuppeteerRepository<ElementPlace, SearchElement> {
  getEndpoint(searchParams: SearchElement): Promise<CheerioAPI>;

  getDocumentHtml(url: string): Promise<CheerioAPI>;

  getDataHtml(): Promise<string>;

  buildElementFromDocument(
    searchParams: SearchElement,
    $: CheerioAPI
  ): ElementPlace[];
}
