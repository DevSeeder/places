import { Injectable } from '@nestjs/common';
import { Browser } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { AbstractService } from '../abstract-service.service';

@Injectable()
export class PuppeteerService extends AbstractService {
  private browser: Browser;

  constructor() {
    super();
    this.setBrowser();
  }

  async setBrowser() {
    this.browser = await puppeteer
      .use(StealthPlugin())
      .launch({ headless: true });
  }

  async newPage() {
    return this.browser.newPage();
  }
}
