import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CheerioAPI } from 'cheerio';
import { InjectPage } from 'nest-puppeteer';
import { Page } from 'puppeteer';
import { NeighborhoodsByCity } from '../../../domain/model/neighborhoods-by-city.model';
import { SearchNeighborhoods } from '../../../domain/model/search-neighborhoods.model';
import { PuppeteerNeighborhoodRepository } from '../../../domain/repository/puppeteer/neighborhood/puppeteer-neighborhood-repository.interface';
import { PuppeteerNeoghborhoodRepository } from '../../../domain/repository/puppeteer/neighborhood/puppeteer-neighborhood.repository';

@Injectable()
export class GuiaMaisRepository
  extends PuppeteerNeoghborhoodRepository
  implements PuppeteerNeighborhoodRepository
{
  constructor(
    protected configService: ConfigService,
    @InjectPage() protected readonly page: Page
  ) {
    super(
      configService.get<string>('repository.neighborhoods.guia-mais.url'),
      page
    );
  }

  buildElementFromDocument(searchParams, $: CheerioAPI): NeighborhoodsByCity[] {
    const arrNeighborhoods = [];
    $('.cities.centerContent')
      .find('a')
      .each(function () {
        const neighborhood = new NeighborhoodsByCity();

        neighborhood.name = $(this).text();
        neighborhood.city = `${searchParams.city.capitalize()} - ${searchParams.state.toUpperCase()}`;

        arrNeighborhoods.push(neighborhood);
      });

    return arrNeighborhoods;
  }

  async getEndpoint(searchParams: SearchNeighborhoods): Promise<CheerioAPI> {
    const url = `${this._url}/${searchParams.city}-${searchParams.state}`;
    return this.getDocumentHtml(url);
  }
}
