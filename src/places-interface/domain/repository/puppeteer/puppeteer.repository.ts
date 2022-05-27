import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { Page } from '../../interface/puppeteer/page.interface';

export abstract class PuppeteerRepository {
  constructor(protected url: string, protected readonly page: Page) {}

  async getDocumentHtml(url: string): Promise<CheerioAPI> {
    await this.goToUrl(url);
    const data = await this.getDataHtml();
    return cheerio.load(data);
  }

  async goToUrl(url: string): Promise<void> {
    await this.page.goto(url, {
      waitUntil: 'networkidle0'
    });
  }

  async getDataHtml(): Promise<string> {
    /* istanbul ignore next */
    return this.page.evaluate(() => document.querySelector('*').outerHTML);
  }
}
