import { Injectable } from '@nestjs/common';
import { Browser, Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import useProxy from 'puppeteer-page-proxy';
import proxyChain from 'proxy-chain';
import { AbstractService } from '../abstract-service.service';
import { randomOne } from 'proxies-generator';
import { Proxy } from 'proxies-generator/typings/instances';

const RETRY_TIMES = 5;

@Injectable()
export class PuppeteerService extends AbstractService {
  private browser: Browser;
  private page: Page;

  constructor() {
    super();
    this.setBrowser();
  }

  private async setBrowser() {
    this.browser = await puppeteer.use(StealthPlugin()).launch({
      ignoreHTTPSErrors: true,
      headless: true,
      args: [
        '--ignore-certificate-errors',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security'
      ],
      slowMo: 200
    });
  }

  private async newPage() {
    this.page = await this.browser.newPage();
  }

  private async collectData(url) {
    try {
      await await this.page.goto(url, {
        waitUntil: 'networkidle0'
      });
      return this.page.evaluate(() => {
        return document.querySelector('*').outerHTML;
      });
    } catch (err) {
      this.logger.error(`Error trying to retrieve html data: ${err.message}`);
      return false;
    }
  }

  async tryCollectData(url) {
    this.logger.log(`Going to url '${url}'...`);

    if (!this.page) await this.newPage();

    let data: any = false;
    let attempts = 0;

    while (data === false && attempts < RETRY_TIMES) {
      this.logger.log(`Trying attempt number ${attempts}...`);

      data = await this.collectData(url);
      attempts += 1;

      if (data === false) {
        await this.changeProxy();
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    return data;
  }

  private async changeProxy() {
    const proxy: Proxy | any = await randomOne();

    const newProxyUrl = await proxyChain.anonymizeProxy({
      url: proxy.url,
      port: proxy.port
    });
    this.logger.verbose(`Changing Proxy to ${newProxyUrl}`);
    await useProxy(this.page, newProxyUrl);
  }
}
