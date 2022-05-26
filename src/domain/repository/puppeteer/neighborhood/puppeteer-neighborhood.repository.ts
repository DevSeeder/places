/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheerioAPI } from 'cheerio';
import { NeighborhoodsByCity } from 'src/domain/model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from 'src/domain/model/search/search-neighborhoods.model';
import { PuppeteerRepository } from '../puppeteer.repository';
import { IPuppeteerNeighborhoodRepository } from '../../../interfaces/puppeteer/repository/puppeteer-neighborhood-repository.interface';

export abstract class PuppeteerNeighborhoodRepository
  extends PuppeteerRepository
  implements IPuppeteerNeighborhoodRepository
{
  async getNeighborhoodsByCity(
    searchParams: SearchNeighborhoods
  ): Promise<NeighborhoodsByCity[]> {
    const $ = await this.callEndpoint(searchParams);
    return this.buildElementFromDocument(searchParams, $);
  }

  buildElementFromDocument(
    _searchParams: SearchNeighborhoods,
    _$: CheerioAPI
  ): NeighborhoodsByCity[] {
    throw new Error('Method not implemented.');
  }

  async callEndpoint(_searchParams: SearchNeighborhoods): Promise<CheerioAPI> {
    throw new Error('Method not implemented.');
  }
}
