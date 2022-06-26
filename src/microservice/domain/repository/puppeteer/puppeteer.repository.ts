import { Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { Page } from '../../interface/puppeteer/page.interface';
import { SearchNeighborhoodsInput } from '../../model/search/neighborhoods/search-neighborhoods-input.model';

export abstract class PuppeteerRepository {
  protected readonly logger: Logger = new Logger(this.constructor.name);

  constructor(protected url: string, protected readonly page: Page) {}

  async getDocumentHtml(url: string): Promise<CheerioAPI> {
    await this.goToUrl(url);
    const data = await this.getDataHtml();
    return cheerio.load(data);
  }

  async goToUrl(url: string): Promise<void> {
    this.logger.log(`Going to page... '${url}'`);
    await this.page.goto(url, {
      waitUntil: 'networkidle0'
    });
  }

  async getDataHtml(): Promise<string> {
    /* istanbul ignore next */
    return this.page.evaluate(() => document.querySelector('*').outerHTML);
  }

  validateInput(searchParams: SearchNeighborhoodsInput) {
    searchParams.validateIsAnyEmptyKey();
  }
}
