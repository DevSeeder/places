/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheerioAPI } from 'cheerio';
import { NeighborhoodsByCity } from 'src/domain/model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from 'src/domain/model/search-neighborhoods.model';
import { PuppeteerRepository } from '../puppeteer.repository';
import { PuppeteerNeighborhoodRepository } from '../../interfaces/puppeteer-neighborhood-repository.interface';

export abstract class PuppeteerNeoghborhoodRepository
  extends PuppeteerRepository
  implements PuppeteerNeighborhoodRepository
{
  async getNeighborhoodsByCity(
    searchParams: SearchNeighborhoods
  ): Promise<NeighborhoodsByCity[]> {
    const $ = await this.getEndpoint(searchParams);
    return this.buildElementFromDocument(searchParams, $);
  }

  buildElementFromDocument(
    searchParams: SearchNeighborhoods,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    $: CheerioAPI
  ): NeighborhoodsByCity[] {
    throw new Error('Method not implemented.');
  }

  async getEndpoint(searchParams: SearchNeighborhoods): Promise<CheerioAPI> {
    throw new Error('Method not implemented.');
  }
}
