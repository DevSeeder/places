/* eslint-disable @typescript-eslint/no-unused-vars */
import { CheerioAPI } from 'cheerio';
import { NeighborhoodsByCity } from '../../../model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from '../../../model/search/search-neighborhoods.model';
import { PuppeteerRepository } from '../puppeteer.repository';
import { IPuppeteerNeighborhoodRepository } from '../../../interface/puppeteer/repository/puppeteer-neighborhood-repository.interface';

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

  abstract buildElementFromDocument(
    _searchParams: SearchNeighborhoods,
    _$: CheerioAPI
  );

  abstract callEndpoint(
    _searchParams: SearchNeighborhoods
  ): Promise<CheerioAPI>;
}
