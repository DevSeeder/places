import { Inject, Injectable } from '@nestjs/common';
import { CheerioAPI } from 'cheerio';
import { InjectPage } from 'nest-puppeteer';
import { Page } from 'puppeteer';
import { NeighborhoodsByCity } from 'src/domain/model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from 'src/domain/model/search-neighborhoods.model';
import { PuppeteerNeighborhoodRepository } from 'src/domain/repository/puppeteer/neighborhood/puppeteer-neighborhood-repository.interface';
import { PuppeteerNeoghborhoodRepository } from 'src/domain/repository/puppeteer/neighborhood/puppeteer-neighborhood.repository';

@Injectable()
export class GuiaMaisRepository
  extends PuppeteerNeoghborhoodRepository
  implements PuppeteerNeighborhoodRepository
{
  constructor(
    @Inject('GUIA_MAIS_NEIGHBORHOODS_URL') protected url: string,
    @InjectPage() protected readonly page: Page
  ) {
    super(url, page);
  }

  buildElementFromDocument(searchParams, $: CheerioAPI): NeighborhoodsByCity[] {
    const arrNeighborhoods = [];
    $('.cities.centerContent')
      .find('a')
      .each(function () {
        const neighborhood = new NeighborhoodsByCity();
        neighborhood.name = $(this).text();
        neighborhood.city =
          searchParams.city.capitalize() +
          '-' +
          searchParams.state.toUpperCase();
        arrNeighborhoods.push(neighborhood);
      });

    return arrNeighborhoods;
  }

  async getEndpoint(searchParams: SearchNeighborhoods): Promise<CheerioAPI> {
    const url = `${this._url}/${searchParams.city}-${searchParams.state}`;
    return await this.getDocumentHtml(url);
  }
}
