import { Injectable } from '@nestjs/common';
import { Page } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import useProxy from 'puppeteer-page-proxy';
import { AbstractService } from '../abstract-service.service';
import { fetchOne } from 'proxies-generator';
import { Proxy } from 'proxies-generator/typings/instances';
import { Cluster } from 'puppeteer-cluster';
const RETRY_TIMES = 1;

@Injectable()
export class PuppeteerService extends AbstractService {
  private puppeteer;

  constructor() {
    super();
    this.setPuppeteer();
  }

  private setPuppeteer() {
    this.puppeteer = puppeteer;
    this.puppeteer.use(StealthPlugin());
  }

  private async collectData(page: Page, url: string) {
    try {
      await page.goto(url, {
        waitUntil: 'networkidle0'
      });
      return page.evaluate(() => {
        return document.querySelector('*').outerHTML;
      });
    } catch (err) {
      this.logger.error(`Error trying to retrieve html data: ${err.message}`);
      return false;
    }
  }

  async tryCollectData(url) {
    this.logger.log(`Going to url '${url}'...`);

    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 1,
      puppeteerOptions: {
        headless: true,
        args: [
          '--ignore-certificate-errors',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security'
        ],
        ignoreHTTPSErrors: true
      }
    });

    const data = await this.executeCluster(cluster, url);

    await cluster.idle();
    await cluster.close();

    return data;
  }

  async executeCluster(cluster: Cluster<any>, url: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await cluster.task(async ({ page, data: _urlData }) => {
      let data: string | boolean = false;
      let i = 0;
      while (!data && i < RETRY_TIMES) {
        data = await this.collectData(page, url);
        i++;
        if (!data) {
          await this.changeProxy(page);
          await new Promise((resolve) => setTimeout(resolve, 3000));
          this.logger.warn(`Trying attempt number ${i}...`);
        }
      }

      return data;
    });

    cluster.queue(url);

    return cluster.execute(url);
  }

  private async changeProxy(page: Page) {
    const proxy: Proxy | any = await fetchOne();
    this.logger.verbose(`Changing Proxy to ${proxy.url}`);
    await useProxy(page, proxy.url);
  }
}
