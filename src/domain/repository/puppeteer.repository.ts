import { InjectPage } from 'nest-puppeteer';
import { Page } from 'puppeteer';
import * as cheerio from 'cheerio';

export class PuppeteerRepository {
  protected _data: string;
  constructor(@InjectPage() protected readonly page: Page) {}

  async getDocumentHtml(url: string) {
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
