import { Page } from 'puppeteer';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';

export class PuppeteerRepository {
  protected _data: string;
  protected _url: string;
  protected _page: Page;

  constructor(protected url: string, protected readonly page: Page) {
    this._url = url;
    this._page = page;
  }

  async getDocumentHtml(url: string): Promise<CheerioAPI> {
    await this.page.goto(url, {
      waitUntil: 'networkidle0'
    });

    const data = await this.page.evaluate(
      () => document.querySelector('*').outerHTML
    );

    this._data = data;
    return cheerio.load(data);
  }
}
