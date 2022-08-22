import { Logger } from '@nestjs/common';
import * as cheerio from 'cheerio';
import { CheerioAPI } from 'cheerio';
import { Page } from 'puppeteer';
import { DTO } from '../../model/dto.model';
import { PuppeteerService } from '../../service/puppeteer/puppeteer.service';

export abstract class PuppeteerRepository {
  protected readonly logger: Logger = new Logger(this.constructor.name);

  protected page: Page;

  constructor(protected readonly puppeteerService: PuppeteerService) {}

  async getPage(): Promise<Page> {
    if (!this.page) this.page = await this.puppeteerService.newPage();
    return this.page;
  }

  async getDocumentHtml(url: string): Promise<CheerioAPI> {
    await this.goToUrl(url);
    const data = await this.getDataHtml();
    return cheerio.load(data);
  }

  async goToUrl(url: string): Promise<void> {
    this.logger.log(`Going to page... '${url}'`);
    const page = await this.getPage();
    await page.goto(url, {
      waitUntil: 'networkidle0'
    });
  }

  async getDataHtml(): Promise<string> {
    /* istanbul ignore next */
    const page = await this.getPage();
    return page.evaluate(() => {
      return document.querySelector('*').outerHTML;
    });
  }

  validateInput(searchParams: DTO) {
    searchParams.validateIsAnyEmptyKey();
  }
}
